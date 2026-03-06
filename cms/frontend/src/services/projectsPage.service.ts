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

export const getProjectsPage = () => ApiHelper.get<ProjectsPage>("/admin/projects-page");
export const updateProjectsPage = (data: any) => ApiHelper.put<ProjectsPage>("/admin/projects-page", data);

export const projectsPageService = {
    get: getProjectsPage,
    update: updateProjectsPage,
};
