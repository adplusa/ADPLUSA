import { ApiHelper } from "./api-helper";

export interface SettingsImage {
    url: string;
    alt?: string;
}

export interface GeneralSettings {
    _id?: string;
    siteName: string;
    siteDescription: string;
    logo?: SettingsImage;
    favicon?: SettingsImage;
    headerLogo?: SettingsImage;
    footerLogo?: SettingsImage;
    customHeadTags?: string;
    metaTags?: Array<{ name: string; content: string }>;
    createdAt?: string;
    updatedAt?: string;
}

export const generalSettingsService = {
    get: () => ApiHelper.get("/api/admin/general-settings"),
    update: (data: any) => ApiHelper.put("/api/admin/general-settings", data),
};

export async function getGeneralSettings(): Promise<GeneralSettings | null> {
    return ApiHelper.get("/api/admin/general-settings");
}

export async function updateGeneralSettings(data: any): Promise<GeneralSettings | null> {
    return ApiHelper.put("/api/admin/general-settings", data);
}
