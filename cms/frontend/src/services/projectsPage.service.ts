import { ApiHelper } from "./api-helper";

export const getProjectsPage = () => ApiHelper.get<any>("/admin/projects-page");
export const updateProjectsPage = (data: any) => ApiHelper.put<any>("/admin/projects-page", data);

export const projectsPageService = {
    get: getProjectsPage,
    update: updateProjectsPage,
};
