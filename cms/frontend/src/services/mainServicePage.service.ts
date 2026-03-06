import { ApiHelper } from "./api-helper";

export interface MainServicePage {
    _id?: string;
    title: string;
    description: string;
    content: string;
    image?: string;
    bannerImage?: { url: string; alt?: string };
    whyWorkWithUsImage?: { url: string; alt?: string };
    whyWorkWithUsItems?: any[];
    metaTags?: Array<{ name: string; content: string }>;
    customHeadTags?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getMainServicePage = () => ApiHelper.get<MainServicePage>("/admin/main-service-page");
export const updateMainServicePage = (data: any) => ApiHelper.put<MainServicePage>("/admin/main-service-page", data);

export const mainServicePageService = {
    get: getMainServicePage,
    update: updateMainServicePage,
};
