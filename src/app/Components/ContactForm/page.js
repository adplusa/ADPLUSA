import React, { useRef, useState, useEffect } from "react";
import "./contactForm.css";
import { countryList } from "../../utils/countryList";

export default function ContactForm({
    title,
    description,
    buttonText,
    serviceOptions = [],
    onSuccess,
}) {
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [isClient, setIsClient] = useState(false);
    const [countryCode, setCountryCode] = useState("+1");

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Default services if none provided
    const defaultServices = [
        "Drafting to CAD (PDF to CAD)",
        "Permit Drawing and Documentation",
        "Working Drawing and Detailing",
        "3D Modelling, Rendering and Walkthrough",
        "360 Degree Views",
        "BIM Services",
        "Bill of Quantities (BOQ)",
        "MEP Drafting",
    ];
    const services = serviceOptions.length > 0 ? serviceOptions : defaultServices;

    const priorityCodes = ["US", "IN", "CN", "GB"];
    const priorityCountries = priorityCodes.map((code) => countryList.find((c) => c.code === code)).filter(Boolean);
    const otherCountries = countryList.filter((c) => !priorityCodes.includes(c.code));

    const sortedCountryList = [
        ...priorityCountries,
        ...otherCountries.sort((a, b) => a.code.localeCompare(b.code)),
    ];

    const validate = (form) => {
        const newErrors = {};
        const firstName = form.firstName?.value?.trim();
        const email = form.email?.value?.trim();
        const phone = form.phone?.value?.trim();

        if (!firstName) newErrors.firstName = "Please enter your name.";
        if (!email) newErrors.email = "Please enter your email.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Enter a valid email.";
        if (!phone) newErrors.phone = "Please enter your phone number.";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setIsSubmitting(true);
        setErrors({});

        const formEl = e.currentTarget;
        const v = validate(formEl);

        if (Object.keys(v).length > 0) {
            setErrors(v);
            setIsSubmitting(false);
            return;
        }

        const honeypot = formEl.querySelector('[name="website"]')?.value;
        if (honeypot) {
            setIsSubmitting(false);
            setStatus({ type: "ok", msg: "Thanks!" });
            return;
        }

        try {
            const name = formEl.firstName.value.trim();
            const email = formEl.email.value.trim();
            const phone = formEl.phone.value.trim();
            const service = formEl.service?.value?.trim() || "General";
            const message = formEl.message?.value?.trim() || "";

            // Client-side HTML content generation
            const htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e5e7eb;">
                        <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Website Inquiry</h2>
                        </div>
                        <div style="padding: 32px;">
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Name</p>
                                <p style="margin: 0; color: #111827; font-size: 16px;">${name}</p>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Service Selected</p>
                                <p style="margin: 0; color: #111827; font-size: 16px;">${service}</p>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Email</p>
                                <p style="margin: 0; color: #111827; font-size: 16px;">
                                    <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a>
                                </p>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Phone</p>
                                <p style="margin: 0; color: #111827; font-size: 16px;">(${countryCode}) ${phone}</p>
                            </div>
                            <div style="margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                                <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Message</p>
                                <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; color: #374151; line-height: 1.6; font-size: 16px;">
                                    ${message.replace(/\n/g, "<br>")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const response = await fetch("/api/contact-proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    service,
                    message,
                    countryCode,
                    emailId: email,
                    htmlContent,
                }),
            });

            const contentType = response.headers.get("content-type");
            let result;
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Server returned non-JSON: ${text}`);
            }

            if (!response.ok || !result.success) {
                throw new Error(result?.error || result?.message || "Failed to send message.");
            }

            formEl.reset();
            setStatus({
                type: "ok",
                msg: result.message || "Message sent! We'll get back to you shortly.",
            });
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error("Contact form error:", err);
            setStatus({
                type: "err",
                msg: err?.message || "Could not send. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="shared-contact-form">
            {title && <h1>{title}</h1>}
            {description && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: description,
                    }}
                />
            )}

            <form
                ref={formRef}
                className="contact-form-internal"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="form-fields">
                    <label htmlFor="fname">Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="fname"
                        placeholder="Your name"
                    />
                    {errors.firstName && (
                        <span className="error">{errors.firstName}</span>
                    )}
                </div>

                <div className="form-fields">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                    />
                    {errors.email && (
                        <span className="error">{errors.email}</span>
                    )}
                </div>

                <div className="form-fields">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="phone-group" suppressHydrationWarning>
                        <select
                            name="countryCode"
                            className="country-select"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            suppressHydrationWarning
                        >
                            {sortedCountryList.map((c) => (
                                <option key={c.code} value={c.dial} suppressHydrationWarning>
                                    {c.flag} {c.dial}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="Your Phone Number"
                        />
                    </div>
                    {errors.phone && (
                        <span className="error">{errors.phone}</span>
                    )}
                </div>

                <div className="form-fields">
                    <label htmlFor="service">Services</label>
                    <select name="service" id="service" defaultValue="">
                        <option value="" disabled>Select Service</option>
                        {services.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="form-fields message">
                    <label htmlFor="message">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        placeholder="Send Your Message"
                    ></textarea>
                </div>

                <input
                    type="text"
                    name="website"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                />

                <div className="contact-btn">
                    <span>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : (buttonText || "Send Message")}
                        </button>
                    </span>
                </div>

                {
                    status && (
                        <p className={status.type === "ok" ? "success status-msg" : "error status-msg"}>
                            {status.msg}
                        </p>
                    )
                }
            </form >
        </div >
    );
}
