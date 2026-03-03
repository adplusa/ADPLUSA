import { Request, Response } from 'express';
import { sendInquiryEmail } from './mail.service';
import { Inquiry } from '../database/schemas/inquiry.schema';


/**
 * The "Sync" function: Handles both the logic and the delivery
 */
export const handleContactSync = async (req: Request, res: Response) => {
    // 1. Get the data from the form submission
    const { name, email, phone, service, message, countryCode, htmlContent } = req.body;
    const userEmail = email; // for clarity

    const spamKeywords = ['casino', 'viagra', 'porn', 'cryptocurrency', 'bitcoin', 'wallet',];
    const contentToCheck = (htmlContent || '').toLowerCase();
    const isSpam = spamKeywords.some(keyword => contentToCheck.includes(keyword)) ||
                   (contentToCheck.match(/http/g) || []).length > 3;

    if (isSpam) {
        return res.status(400).json({ error: "Message rejected due to suspicious content." });
    }

    try {
        const inquiry = new Inquiry({
            name,
            email,
            phone,
            countryCode,
            service: service || 'General',
            message,
            htmlContent,
            status: 'new',
        });
        await inquiry.save();

        const targetEmail = "info@adplusa.com";
        await sendInquiryEmail(userEmail, htmlContent, targetEmail);

        res.status(200).json({
            success: true,
            message: `Message received! We will contact you shortly.`
        });
    } catch (error: any) {
        console.error("Email send error:", error);
        res.status(500).json({
            error: "Failed to send email. Please try again."
        });
    }
};