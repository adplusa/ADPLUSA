import nodemailer from "nodemailer";

// Create Nodemailer transporter with SMTP configuration
// Supports multiple providers: Gmail, Outlook, custom SMTP, etc.
const createTransporter = () => {
    const transportConfig = {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    };

    return nodemailer.createTransport(transportConfig);
};

// Company details
const COMPANY_NAME = process.env.COMPANY_NAME || "ADPL Consulting";
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "contact@adplconsulting.com";
const FROM_EMAIL =
    process.env.FROM_EMAIL ||
    process.env.SMTP_USER ||
    "noreply@adplconsulting.com";

// ADPL Consulting Theme Colors
const THEME = {
    primary: "#8a0b0e", // Brand red
    primaryDark: "#6d080b", // Darker red for hover
    background: "#ffffff",
    backgroundAlt: "#fafafa",
    foreground: "#171717",
    border: "#c4c4c4",
    muted: "#666666",
};

/**
 * Send acknowledgment email to the person who submitted the contact form
 */
export async function sendAcknowledgmentEmail({
    name,
    email,
    service,
    message,
}) {
    const transporter = createTransporter();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Us</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Lato', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: ${THEME.background}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid ${THEME.border};">
          
          <!-- Header with Logo Area -->
          <tr>
            <td style="background-color: ${THEME.primary}; padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">ADPL Consulting</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">Building Excellence Together</p>
            </td>
          </tr>
          
          <!-- Red accent line -->
          <tr>
            <td style="background-color: ${THEME.primaryDark}; height: 4px;"></td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: ${THEME.foreground}; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                Hello, ${name}!
              </h2>
              
              <p style="color: ${THEME.foreground}; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                Thank you for reaching out to us. We have received your message and appreciate your interest in our services.
              </p>
              
              <p style="color: ${THEME.foreground}; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0;">
                Our team will review your inquiry and respond within <strong style="color: ${THEME.primary};">24-48 hours</strong>.
              </p>
              
              <!-- Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${THEME.backgroundAlt}; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${THEME.primary};">
                <tr>
                  <td style="padding: 20px 25px;">
                    <h3 style="color: ${THEME.foreground}; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">Your Request Summary</h3>
                    ${
                        service
                            ? `
                    <p style="color: ${THEME.muted}; margin: 8px 0; font-size: 14px;">
                      <strong style="color: ${THEME.foreground};">Service Interest:</strong> ${service}
                    </p>`
                            : ""
                    }
                    ${
                        message
                            ? `
                    <p style="color: ${THEME.muted}; margin: 8px 0; font-size: 14px;">
                      <strong style="color: ${THEME.foreground};">Message:</strong> ${message.substring(0, 150)}${message.length > 150 ? "..." : ""}
                    </p>`
                            : ""
                    }
                  </td>
                </tr>
              </table>
              
              <p style="color: ${THEME.foreground}; font-size: 16px; line-height: 1.7; margin: 25px 0 0 0;">
                Need immediate assistance? Feel free to contact us directly:
              </p>
              
              <p style="margin: 15px 0;">
                <a href="mailto:${COMPANY_EMAIL}" style="color: ${THEME.primary}; text-decoration: none; font-weight: 600;">${COMPANY_EMAIL}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: ${THEME.backgroundAlt}; padding: 25px 40px; border-top: 1px solid ${THEME.border};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: ${THEME.muted}; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">
                      ${COMPANY_NAME}
                    </p>
                    <p style="color: ${THEME.muted}; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} All rights reserved.
                    </p>
                    <p style="color: #999999; font-size: 11px; margin: 15px 0 0 0;">
                      This is an automated message. Please do not reply directly to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

    const textContent = `
Hello, ${name}!

Thank you for reaching out to ${COMPANY_NAME}. We have received your message and appreciate your interest in our services.

Our team will review your inquiry and respond within 24-48 hours.

Your Request Summary:
${service ? `- Service Interest: ${service}` : ""}
${message ? `- Message: ${message}` : ""}

Need immediate assistance? Contact us at ${COMPANY_EMAIL}.

---
© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
  `;

    return transporter.sendMail({
        from: `"${COMPANY_NAME}" <${FROM_EMAIL}>`,
        to: email,
        subject: `Thank you for contacting ${COMPANY_NAME}`,
        text: textContent,
        html: htmlContent,
    });
}

/**
 * Send notification email to the company about a new contact request
 */
export async function sendNotificationEmail({
    name,
    email,
    phone,
    service,
    message,
    submittedAt,
}) {
    const transporter = createTransporter();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Request</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Lato', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: ${THEME.background}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid ${THEME.border};">
          
          <!-- Header -->
          <tr>
            <td style="background-color: ${THEME.primary}; padding: 25px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">
                      🔔 New Contact Request
                    </h1>
                  </td>
                  <td style="text-align: right;">
                    <span style="color: rgba(255,255,255,0.8); font-size: 12px;">via Website Form</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Red accent line -->
          <tr>
            <td style="background-color: ${THEME.primaryDark}; height: 4px;"></td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 35px 40px;">
              <p style="color: ${THEME.foreground}; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                You have received a new contact form submission. Details below:
              </p>
              
              <!-- Contact Details Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid ${THEME.border}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 15px 20px; background-color: ${THEME.backgroundAlt}; border-bottom: 1px solid ${THEME.border}; width: 120px;">
                    <strong style="color: ${THEME.muted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Name</strong>
                  </td>
                  <td style="padding: 15px 20px; border-bottom: 1px solid ${THEME.border}; color: ${THEME.foreground}; font-size: 15px; font-weight: 600;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 20px; background-color: ${THEME.backgroundAlt}; border-bottom: 1px solid ${THEME.border};">
                    <strong style="color: ${THEME.muted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                  </td>
                  <td style="padding: 15px 20px; border-bottom: 1px solid ${THEME.border};">
                    <a href="mailto:${email}" style="color: ${THEME.primary}; text-decoration: none; font-weight: 500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 20px; background-color: ${THEME.backgroundAlt}; border-bottom: 1px solid ${THEME.border};">
                    <strong style="color: ${THEME.muted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</strong>
                  </td>
                  <td style="padding: 15px 20px; border-bottom: 1px solid ${THEME.border};">
                    <a href="tel:${phone}" style="color: ${THEME.primary}; text-decoration: none; font-weight: 500;">${phone}</a>
                  </td>
                </tr>
                ${
                    service
                        ? `
                <tr>
                  <td style="padding: 15px 20px; background-color: ${THEME.backgroundAlt}; border-bottom: 1px solid ${THEME.border};">
                    <strong style="color: ${THEME.muted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Service</strong>
                  </td>
                  <td style="padding: 15px 20px; border-bottom: 1px solid ${THEME.border}; color: ${THEME.foreground};">
                    ${service}
                  </td>
                </tr>
                `
                        : ""
                }
                <tr>
                  <td style="padding: 15px 20px; background-color: ${THEME.backgroundAlt}; border-bottom: 1px solid ${THEME.border};">
                    <strong style="color: ${THEME.muted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Submitted</strong>
                  </td>
                  <td style="padding: 15px 20px; border-bottom: 1px solid ${THEME.border}; color: ${THEME.muted}; font-size: 14px;">
                    ${submittedAt}
                  </td>
                </tr>
                ${
                    message
                        ? `
                <tr>
                  <td style="padding: 15px 20px; background-color: ${THEME.backgroundAlt}; vertical-align: top;">
                    <strong style="color: ${THEME.muted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message</strong>
                  </td>
                  <td style="padding: 15px 20px;">
                    <p style="margin: 0; white-space: pre-wrap; color: ${THEME.foreground}; font-size: 14px; line-height: 1.6;">${message}</p>
                  </td>
                </tr>
                `
                        : ""
                }
              </table>
              
              <!-- Reply Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}?subject=Re: Your inquiry to ${COMPANY_NAME}" 
                   style="display: inline-block; background-color: ${THEME.primary}; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">
                  Reply to ${name.split(" ")[0]}
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: ${THEME.backgroundAlt}; padding: 20px 40px; text-align: center; border-top: 1px solid ${THEME.border};">
              <p style="color: ${THEME.muted}; font-size: 12px; margin: 0;">
                This notification was generated from your website contact form.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

    const textContent = `
NEW CONTACT REQUEST
===================

You have received a new contact form submission.

CONTACT DETAILS:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
${service ? `- Service: ${service}` : ""}
- Submitted: ${submittedAt}
${message ? `\nMESSAGE:\n${message}` : ""}

---
This notification was generated from your website contact form.
  `;

    return transporter.sendMail({
        from: `"${COMPANY_NAME} Website" <${FROM_EMAIL}>`,
        to: COMPANY_EMAIL,
        replyTo: email,
        subject: `🔔 New Contact Request from ${name}`,
        text: textContent,
        html: htmlContent,
    });
}

/**
 * Utility function to add delay between operations
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
