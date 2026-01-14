import { axiosApi } from "./axios";

// General Settings Types
export interface SettingsImage {
    url: string;
    alt?: string;
}

export interface GeneralSettings {
    _id: string;
    headerLogo?: SettingsImage;
    footerLogo?: SettingsImage;
    favicon?: SettingsImage;
    siteName?: string;
    siteDescription?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GeneralSettingsResponse {
    success: boolean;
    data: GeneralSettings;
}

export interface UpdateGeneralSettingsData {
    headerLogo?: SettingsImage | null;
    footerLogo?: SettingsImage | null;
    favicon?: SettingsImage | null;
    siteName?: string;
    siteDescription?: string;
}

// General Settings API Functions
export const getGeneralSettings =
    async (): Promise<GeneralSettingsResponse> => {
        const response = await axiosApi.get<GeneralSettingsResponse>(
            "/public/general-settings"
        );
        return response.data;
    };

export const updateGeneralSettings = async (
    data: UpdateGeneralSettingsData
): Promise<GeneralSettingsResponse> => {
    const response = await axiosApi.put<GeneralSettingsResponse>(
        "/admin/general-settings",
        data
    );
    return response.data;
};
