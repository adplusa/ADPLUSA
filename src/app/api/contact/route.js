import { NextResponse } from "next/server";
import {
    sendAcknowledgmentEmail,
    sendNotificationEmail,
    delay,
} from "@/lib/email";

// In-memory rate limiting store
// In production, consider using Redis or similar for distributed rate limiting
const rateLimitStore = new Map();

const RATE_LIMIT_WINDOW_MS =
    parseInt(process.env.EMAIL_RATE_LIMIT_WINDOW_MS) || 60000; // 1 minute
const RATE_LIMIT_MAX = parseInt(process.env.EMAIL_RATE_LIMIT_MAX) || 5; // 5 requests per window
const EMAIL_DELAY_MS = 500; // Delay between sending emails to prevent overload

/**
 * Clean up old rate limit entries
 */
function cleanupRateLimitStore() {
    const now = Date.now();
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
            rateLimitStore.delete(ip);
        }
    }
}

/**
 * Check and update rate limit for an IP
 * Returns true if request is allowed, false if rate limited
 */
function checkRateLimit(ip) {
    cleanupRateLimitStore();

    const now = Date.now();
    const data = rateLimitStore.get(ip);

    if (!data || now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
        // New window
        rateLimitStore.set(ip, { windowStart: now, count: 1 });
        return true;
    }

    if (data.count >= RATE_LIMIT_MAX) {
        return false;
    }

    data.count++;
    return true;
}

/**
 * Get client IP from request headers
 */
function getClientIP(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request) {
    try {
        // Get client IP for rate limiting
        const clientIP = getClientIP(request);

        // Check rate limit
        if (!checkRateLimit(clientIP)) {
            console.log(`Rate limit exceeded for IP: ${clientIP}`);
            return NextResponse.json(
                {
                    success: false,
                    error: "Too many requests. Please try again in a minute.",
                },
                { status: 429 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { name, email, phone, service, message, website } = body;

        // Honeypot check - if 'website' field is filled, it's likely a bot
        if (website) {
            console.log("Honeypot triggered, rejecting request");
            // Return success to not reveal detection to bots
            return NextResponse.json({ success: true });
        }

        // Validate required fields
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Name is required" },
                { status: 400 }
            );
        }

        if (
            !email ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return NextResponse.json(
                { success: false, error: "Valid email is required" },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Phone number is required" },
                { status: 400 }
            );
        }

        // Generate timestamp
        const submittedAt = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true,
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        // Prepare email data
        const emailData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            service: service?.trim() || "",
            message: message?.trim() || "",
            submittedAt,
        };

        console.log("Processing contact form submission:", {
            name: emailData.name,
            email: emailData.email,
        });

        // Send acknowledgment email to the sender
        try {
            await sendAcknowledgmentEmail(emailData);
            console.log("Acknowledgment email sent to:", emailData.email);
        } catch (ackError) {
            console.error("Failed to send acknowledgment email:", ackError);
            // Continue to send notification even if acknowledgment fails
        }

        // Add delay between emails to prevent overloading
        await delay(EMAIL_DELAY_MS);

        // Send notification email to the company
        try {
            await sendNotificationEmail(emailData);
            console.log("Notification email sent to company");
        } catch (notifyError) {
            console.error("Failed to send notification email:", notifyError);
            // If notification fails, we might want to log this for manual follow-up
        }

        return NextResponse.json({
            success: true,
            message:
                "Thank you for your message. We'll get back to you within 24-48 hours.",
        });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "An error occurred while processing your request. Please try again.",
            },
            { status: 500 }
        );
    }
}
