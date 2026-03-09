import { ApiHelper } from "./api-helper";

// Types
export interface AnchorLink {
    id: string;
    label: string;
    targetId?: string;
}

export interface AboutSection {
    sectionId?: string;
    title: string;
    description: string;
    content: string;
    body?: string;
    image?: string | { url: string; alt?: string; darkModeUrl?: string };
}

export interface About {
    _id?: string;
    title: string;
    description: string;
    content: string;
    image?: string;
    allowLightHeading?: boolean;
    allowUsHeading?: boolean;
    allowRightHeading?: boolean;
    paragraph?: string;
    anchorLinks: AnchorLink[];
    sections: AboutSection[];
    seoTitle?: string;
    seoDescription?: string;
    metaTags?: Array<{ name: string; content: string }>;
    customHeadTags?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Contact {
    _id?: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    contactInfo: {
        email: string;
        phone: string;
        address: string;
        socialMedia?: {
            facebook?: string;
            instagram?: string;
            linkedin?: string;
            twitter?: string;
            youtube?: string;
        };
    };
    googleMapEmbedUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    metaTags?: Array<{ name: string; content: string }>;
    customHeadTags?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FAQQuestion {
    question: string;
    answer: string;
    order?: number;
    [key: string]: any;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface FAQCategory {
    id?: string;
    name?: string;
    title?: string;
    description?: string;
    questions?: FAQQuestion[];
    faqs?: FAQItem[];
    chatLink?: string;
    order?: number;
    [key: string]: any;
}

export interface FAQ {
    _id?: string;
    title: string;
    description: string;
    categories: FAQCategory[];
    seoTitle?: string;
    seoDescription?: string;
    metaTags?: Array<{ name: string; content: string }> | any[];
    customHeadTags?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getFAQ = () => ApiHelper.get<FAQ>("/admin/faq");
export const updateFAQ = (data: any) => ApiHelper.put<FAQ>("/admin/faq", data);

export const getAbout = () => ApiHelper.get<About>("/admin/about");
export const updateAbout = (data: any) => ApiHelper.put<About>("/admin/about", data);

export const getContact = () => ApiHelper.get<Contact>("/admin/contact");
export const updateContact = (data: any) => ApiHelper.put<Contact>("/admin/contact", data);

export const contentService = {
    getFAQ,
    updateFAQ,
    getAbout,
    updateAbout,
    getContact,
    updateContact,
};
