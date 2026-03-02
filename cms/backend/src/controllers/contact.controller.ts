import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendInquiryEmail } from './mail.service';
import { GeneralSettingsSchema } from '../database/schemas/generalSettings.schema';
import { Contact } from '../database/schemas/contact.schema';

const GeneralSettings = (mongoose.models.GeneralSettings || mongoose.model('GeneralSettings', GeneralSettingsSchema)) as mongoose.Model<any>;

/**
 * The "Sync" function: Handles both the logic and the delivery
 */
export const handleContactSync = async (req: Request, res: Response) => {
    // 1. Get the data from the form submission
    const { emailId, htmlContent, countryCode: rawCountryCode } = req.body;
    const userEmail = emailId; // for clarity
    const countryCode = rawCountryCode || "N/A";

    // Simple Spam Check
    const spamKeywords = ['casino', 'viagra', 'porn', 'cryptocurrency', 'bitcoin', 'wallet',];
    const contentToCheck = (htmlContent || '').toLowerCase();
    const isSpam = spamKeywords.some(keyword => contentToCheck.includes(keyword)) ||
        (contentToCheck.match(/http/g) || []).length > 3;

    if (isSpam) {
        return res.status(400).json({ error: "Message rejected due to suspicious content." });
    }

    try {
        // 2. Fetch settings and the Contact page configuration from DB
        const settings = await GeneralSettings.findOne();
        // Get the latest contact doc (sort by desc to ensure we get the active one if duplicates exist)
        const contactDoc = await Contact.findOne().sort({ updatedAt: -1 });
        // 3. Trigger Action B: Send the email
        // Optimization: Send in background (Fire-and-Forget) to avoid 5-7s delay
        sendInquiryEmail(userEmail, htmlContent).catch(() => { });

        res.status(200).json({
            success: true,
            message: `✅ Message received! We will contact you shortly.`
        });
    } catch (error: any) {
        res.status(500).json({
            error: "Email relay failed. Check backend console for details."
        });
    }
};