import { axiosApi } from "./axios";
import type { MetaTag } from "../components/MetaTagsInput";

/**
 * Image interface for main service page
 */
export interface MainServicePageImage {
    url: string;
    alt?: string;
}

/**
 * Why Work With Us item interface
 */
export interface WhyWorkWithUsItem {
    icon?: string;
    title: string;
    description: string;
}

/**
 * Main Service Page data interface
 */
export interface MainServicePage {
    _id?: string;
    // Banner
    bannerImage?: MainServicePageImage;
    bannerTitle?: string;

    // Page Content
    pageTitle?: string;
    pageSubtitle?: string;

    // Trust Icons Section
    showTrustIcons: boolean;
    trustIconsHeading?: string;

    // Services Section
    servicesHeading?: string;

    // Why Work With Us Section
    showWhyWorkWithUs: boolean;
    whyWorkWithUsHeading?: string;
    whyWorkWithUsItems: WhyWorkWithUsItem[];
    whyWorkWithUsImage?: MainServicePageImage;

    // Contact Form Section
    showContactForm: boolean;
    contactFormHeading?: string;
    contactFormSubheading?: string;

    // SEO Fields
    seoTitle?: string;
    seoDescription?: string;
    metaTags?: MetaTag[];

    // Timestamps
    createdAt?: string;
    updatedAt?: string;
}

/**
 * API response interface
 */
export interface MainServicePageResponse {
    success: boolean;
    data: MainServicePage;
    message?: string;
}

/**
 * Get main service page content
 * @returns Promise with main service page data
 */
export const getMainServicePage = async (): Promise<MainServicePageResponse> => {
    const response = await axiosApi.get<MainServicePageResponse>(
        "/public/main-service-page"
    );
    return response.data;
};

/**
 * Update main service page content
 * @param data - Main service page data to update
 * @returns Promise with updated main service page data
 */
export const updateMainServicePage = async (
    data: Partial<MainServicePage>
): Promise<MainServicePageResponse> => {
    const response = await axiosApi.put<MainServicePageResponse>(
        "/admin/main-service-page",
        data
    );
    return response.data;
};
