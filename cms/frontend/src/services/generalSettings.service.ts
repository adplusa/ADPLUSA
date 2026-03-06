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
    headerLogo?: SettingsImage | null;
    footerLogo?: SettingsImage | null;
    customHeadTags?: string;
    metaTags?: Array<{ name: string; content: string }>;
    createdAt?: string;
    updatedAt?: string;
}

export const getGeneralSettings = () => ApiHelper.get<GeneralSettings>("/admin/general-settings");
export const updateGeneralSettings = (data: Partial<GeneralSettings>) => ApiHelper.put<any>("/admin/general-settings", data);

export const generalSettingsService = {
    get: getGeneralSettings,
    update: updateGeneralSettings,
};
