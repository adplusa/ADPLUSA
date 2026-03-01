import { ApiHelper } from "./api-helper";

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
        socialMedia?: Array<{ platform: string; url: string }>;
    };
    googleMapEmbedUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    metaTags?: Array<{ name: string; content: string }>;
    customHeadTags?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface FAQCategory {
    id: string;
    title: string;
    description?: string;
    faqs: FAQItem[];
    chatLink?: string;
}

export interface FAQ {
    _id?: string;
    title: string;
    description: string;
    categories: FAQCategory[];
    seoTitle?: string;
    seoDescription?: string;
    metaTags?: Array<{ name: string; content: string }>;
    customHeadTags?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const contentService = {
    getFAQ: () => ApiHelper.get("/api/admin/faq"),
    updateFAQ: (data: any) => ApiHelper.put("/api/admin/faq", data),

    getAbout: () => ApiHelper.get("/api/admin/about"),
    updateAbout: (data: any) => ApiHelper.put("/api/admin/about", data),

    getContact: () => ApiHelper.get("/api/admin/contact"),
    updateContact: (data: any) => ApiHelper.put("/api/admin/contact", data),
};

export async function getFAQ(): Promise<any> {
    return ApiHelper.get("/api/admin/faq");
}

export async function updateFAQ(data: any): Promise<any> {
    return ApiHelper.put("/api/admin/faq", data);
}

export async function getAbout(): Promise<any> {
    return ApiHelper.get("/api/admin/about");
}

export async function updateAbout(data: any): Promise<any> {
    return ApiHelper.put("/api/admin/about", data);
}

export async function getContact(): Promise<any> {
    return ApiHelper.get("/api/admin/contact");
}

export async function updateContact(data: any): Promise<any> {
    return ApiHelper.put("/api/admin/contact", data);
}
