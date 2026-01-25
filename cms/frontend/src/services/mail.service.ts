import { axiosApi } from './axios';

/**
 * Action B: The actual shipping function
 * This sends the mail to the target address you saved in the CMS.
 */
export const sendInquiryEmail = async (userEmail: string, htmlContent: string) => {
    // Send the email request to the backend API
    const response = await axiosApi.post('/contact/send', {
        emailId: userEmail,
        htmlContent
    });
    return response.data;
};