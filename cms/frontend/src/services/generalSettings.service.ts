import { ApiHelper } from "./api-helper";

export const generalSettingsService = {
    get: () => ApiHelper.get("/api/admin/general-settings"),
    update: (data: any) => ApiHelper.put("/api/admin/general-settings", data),
};
