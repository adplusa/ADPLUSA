import { axiosApi } from "./axios";
import type { MetaTag } from "../components/MetaTagsInput";

/**
 * Projects Page data interface
 */
export interface ProjectsPage {
    _id?: string;
    // Page Content
    pageTitle?: string;
    pageSubtitle?: string;
    heading?: string;

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
export interface ProjectsPageResponse {
    success: boolean;
    data: ProjectsPage;
    message?: string;
}

/**
 * Get projects page content
 * @returns Promise with projects page data
 */
export const getProjectsPage = async (): Promise<ProjectsPageResponse> => {
    const response = await axiosApi.get<ProjectsPageResponse>(
        "/public/projects-page"
    );
    return response.data;
};

/**
 * Update projects page content
 * @param data - Projects page data to update
 * @returns Promise with updated projects page data
 */
export const updateProjectsPage = async (
    data: Partial<ProjectsPage>
): Promise<ProjectsPageResponse> => {
    const response = await axiosApi.put<ProjectsPageResponse>(
        "/admin/projects-page",
        data
    );
    return response.data;
};
