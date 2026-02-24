import { ApiHelper } from "./api-helper";

export const mainServicePageService = {
    get: () => ApiHelper.get("/api/admin/main-service-page"),
    update: (data: any) => ApiHelper.put("/api/admin/main-service-page", data),
};
