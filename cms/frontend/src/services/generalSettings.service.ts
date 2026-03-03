import { ApiHelper } from "./api-helper";

export interface SettingsImage {
    url: string;
    alt?: string;
}

export interface GeneralSettings {
    siteName?: string;
    siteDescription?: string;
    headerLogo?: SettingsImage | null;
    footerLogo?: SettingsImage | null;
    favicon?: SettingsImage | null;
    customHeadTags?: string;
}

export const getGeneralSettings = () => ApiHelper.get<GeneralSettings>("/admin/general-settings");
export const updateGeneralSettings = (data: Partial<GeneralSettings>) => ApiHelper.put<any>("/admin/general-settings", data);

export const generalSettingsService = {
    get: getGeneralSettings,
    update: updateGeneralSettings,
};
