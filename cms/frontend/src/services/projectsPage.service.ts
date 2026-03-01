import { ApiHelper } from "./api-helper";

export interface ProjectsPage {
    _id?: string;
    title: string;
    description: string;
    content: string;
    image?: string;
    metaTags?: Array<{ name: string; content: string }>;
    customHeadTags?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const projectsPageService = {
    get: () => ApiHelper.get("/api/admin/projects-page"),
    update: (data: any) => ApiHelper.put("/api/admin/projects-page", data),
};

export async function getProjectsPage(): Promise<ProjectsPage | null> {
    return ApiHelper.get("/api/admin/projects-page");
}

export async function updateProjectsPage(data: any): Promise<ProjectsPage | null> {
    return ApiHelper.put("/api/admin/projects-page", data);
}
