import { axiosApi } from "./axios";

// FAQ Types
export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQCategory {
    title: string;
    description?: string;
    chatLink?: string;
    image?: {
        url: string;
        darkModeUrl?: string;
    };
    faqs: FAQItem[];
}

export interface FAQ {
    _id: string;
    title: string;
    categories: FAQCategory[];
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FAQResponse {
    success: boolean;
    data: FAQ;
}

export interface UpdateFAQData {
    title: string;
    categories: Array<{
        title: string;
        description?: string;
        chatLink?: string;
        image?: {
            url: string;
            darkModeUrl?: string;
        };
        faqs: Array<{
            question: string;
            answer: string;
        }>;
    }>;
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
}

// About Types
export interface AboutImage {
    url: string;
    darkModeUrl?: string;
}

export interface AnchorLink {
    label: string;
    targetId: string;
}

export interface AboutSection {
    sectionId: string;
    title: string;
    body: string;
    image?: AboutImage;
}

export interface About {
    _id: string;
    allowLightHeading?: string;
    allowUsHeading?: string;
    allowRightHeading?: string;
    paragraph?: string;
    anchorLinks: AnchorLink[];
    sections: AboutSection[];
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AboutResponse {
    success: boolean;
    data: About;
}

export interface UpdateAboutData {
    allowLightHeading?: string;
    allowUsHeading?: string;
    allowRightHeading?: string;
    paragraph?: string;
    anchorLinks?: AnchorLink[];
    sections?: AboutSection[];
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
}

// Contact Types
export interface Contact {
    _id: string;
    title: string;
    description?: string;
    contactInfo: {
        email?: string;
        phone?: string;
        address?: string;
        socialMedia?: {
            facebook?: string;
            twitter?: string;
            instagram?: string;
            linkedin?: string;
            youtube?: string;
        };
    };
    socialLinks?: Array<{
        platform: string;
        url: string;
        isActive: boolean;
    }>;
    serviceOptions?: string[];
    googleMapEmbedUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContactResponse {
    success: boolean;
    data: Contact;
}

export interface UpdateContactData {
    title: string;
    description?: string;
    contactInfo: {
        email?: string;
        phone?: string;
        address?: string;
        socialMedia?: {
            facebook?: string;
            twitter?: string;
            instagram?: string;
            linkedin?: string;
            youtube?: string;
        };
    };
    socialLinks?: Array<{
        platform: string;
        url: string;
        isActive: boolean;
    }>;
    serviceOptions?: string[];
    googleMapEmbedUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    customHeadTags?: string;
}

// FAQ API Functions
export const getFAQ = async (): Promise<FAQResponse> => {
    const response = await axiosApi.get<FAQResponse>("/faq");
    return response.data;
};

export const updateFAQ = async (data: UpdateFAQData): Promise<FAQResponse> => {
    const response = await axiosApi.put<FAQResponse>("/admin/faq", data);
    return response.data;
};

// About API Functions
export const getAbout = async (): Promise<AboutResponse> => {
    const response = await axiosApi.get<AboutResponse>("/about");
    return response.data;
};

export const updateAbout = async (
    data: UpdateAboutData
): Promise<AboutResponse> => {
    const response = await axiosApi.put<AboutResponse>("/admin/about", data);
    return response.data;
};

// Contact API Functions
export const getContact = async (): Promise<ContactResponse> => {
    const response = await axiosApi.get<ContactResponse>("/contact");
    return response.data;
};

export const updateContact = async (
    data: UpdateContactData
): Promise<ContactResponse> => {
    const response = await axiosApi.put<ContactResponse>(
        "/admin/contact",
        data
    );
    return response.data;
};
