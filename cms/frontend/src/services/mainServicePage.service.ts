import { ApiHelper } from "./api-helper";

export const getMainServicePage = () => ApiHelper.get<any>("/admin/main-service-page");
export const updateMainServicePage = (data: any) => ApiHelper.put<any>("/admin/main-service-page", data);

export const mainServicePageService = {
    get: getMainServicePage,
    update: updateMainServicePage,
};
