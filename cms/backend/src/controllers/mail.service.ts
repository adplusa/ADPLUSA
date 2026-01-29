import nodemailer from 'nodemailer';

// This creates the connection to Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

console.log(`[MailService] Configured with User: ${process.env.GMAIL_USER ? 'SET' : 'MISSING'}, Pass: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'MISSING'}`);

/**
 * Action B: The actual email sending function
 * @param userEmail - The email of the person filling out the form
 * @param htmlContent - The formatted message body
 * @param targetEmail - The email address that will receive the inquiry
 */
export const sendInquiryEmail = async (userEmail: string, htmlContent: string, targetEmail: string) => {
    return await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: targetEmail,
        subject: `ADPL Site Inquiry from ${userEmail}`,
        html: htmlContent
    });
};