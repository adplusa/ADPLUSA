import { axiosApi } from "./axios";

// Types
export interface FAQ {
    _id?: string;
    categories: FAQCategory[];
    seoTitle?: string;
    seoDescription?: string;
    metaTags?: any[];
    [key: string]: any;
}

export interface FAQCategory {
    name: string;
    questions: FAQQuestion[];
    order?: number;
    [key: string]: any;
}

export interface FAQQuestion {
    question: string;
    answer: string;
    order?: number;
    [key: string]: any;
}

export interface About {
    _id?: string;
    [key: string]: any;
}

export interface Contact {
    _id?: string;
    [key: string]: any;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const getFAQ = async (): Promise<ApiResponse<FAQ>> => {
    const response = await axiosApi.get<ApiResponse<FAQ>>("/admin/faq");
    return response.data;
};

export const updateFAQ = async (data: any): Promise<ApiResponse<FAQ>> => {
    const response = await axiosApi.put<ApiResponse<FAQ>>("/admin/faq", data);
    return response.data;
};

export const getAbout = async (): Promise<ApiResponse<About>> => {
    const response = await axiosApi.get<ApiResponse<About>>("/admin/about");
    return response.data;
};

export const updateAbout = async (data: any): Promise<ApiResponse<About>> => {
    const response = await axiosApi.put<ApiResponse<About>>("/admin/about", data);
    return response.data;
};

export const getContact = async (): Promise<ApiResponse<Contact>> => {
    const response = await axiosApi.get<ApiResponse<Contact>>("/admin/contact");
    return response.data;
};

export const updateContact = async (data: any): Promise<ApiResponse<Contact>> => {
    const response = await axiosApi.put<ApiResponse<Contact>>("/admin/contact", data);
    return response.data;
};

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
    getFAQ,
    updateFAQ,
    getAbout,
    updateAbout,
    getContact,
    updateContact,
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
