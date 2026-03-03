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

export const contentService = {
    getFAQ,
    updateFAQ,
    getAbout,
    updateAbout,
    getContact,
    updateContact,
};
