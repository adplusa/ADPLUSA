import { ApiHelper } from "./api-helper";

export const projectsPageService = {
    get: () => ApiHelper.get("/api/admin/projects-page"),
    update: (data: any) => ApiHelper.put("/api/admin/projects-page", data),
};
