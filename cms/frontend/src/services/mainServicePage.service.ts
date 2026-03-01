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

export const mainServicePageService = {
    get: () => ApiHelper.get("/api/admin/main-service-page"),
    update: (data: any) => ApiHelper.put("/api/admin/main-service-page", data),
};

export async function getMainServicePage(): Promise<MainServicePage | null> {
    return ApiHelper.get("/api/admin/main-service-page");
}

export async function updateMainServicePage(data: any): Promise<MainServicePage | null> {
    return ApiHelper.put("/api/admin/main-service-page", data);
}
