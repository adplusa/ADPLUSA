import { ApiHelper } from "./api-helper";

export const contentService = {
    getFAQ: () => ApiHelper.get("/api/admin/faq"),
    updateFAQ: (data: any) => ApiHelper.put("/api/admin/faq", data),

    getAbout: () => ApiHelper.get("/api/admin/about"),
    updateAbout: (data: any) => ApiHelper.put("/api/admin/about", data),

    getContact: () => ApiHelper.get("/api/admin/contact"),
    updateContact: (data: any) => ApiHelper.put("/api/admin/contact", data),
};
