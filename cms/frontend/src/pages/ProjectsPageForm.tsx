import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { seoSchema } from "../utils/validation";
import {
    getProjectsPage,
    updateProjectsPage,
} from "../services/projectsPage.service";
import MetaTagsInput from "../components/MetaTagsInput";

// --- Validation Schema ---
const projectsPageSchema = z
    .object({
        _id: z.string().optional(),
        // Page Content
        pageTitle: z.string().optional(),
        pageSubtitle: z.string().optional(),
        heading: z.string().optional(),
        // Timestamps
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .merge(seoSchema);

type ProjectsPageFormData = z.infer<typeof projectsPageSchema>;

export default function ProjectsPageForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("content");

    const form = useForm<ProjectsPageFormData>({
        resolver: zodResolver(projectsPageSchema) as any,
        defaultValues: {
            pageTitle: "",
            pageSubtitle: "",
            heading: "",
            seoTitle: "",
            seoDescription: "",
            metaTags: [],
        },
    });

    const {
        register,
        control,
        reset,
    } = form;

    // Load Projects Page Data
    const loadProjectsPage = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProjectsPage();
            if (response.data) {
                reset({
                    ...response.data,
                    metaTags: response.data.metaTags || [],
                });
            }
        } catch (err: any) {
            // If 404, it means no data exists yet - that's okay for a singleton
            if (err.response?.status === 404) {
                setError(null);
            } else {
                const errorMessage =
                    err.response?.data?.error?.message ||
                    "Failed to load Projects Page";
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        loadProjectsPage();
    }, [loadProjectsPage]);

    const onSubmit = useCallback(async (data: ProjectsPageFormData) => {
        setIsSubmitting(true);
        setError(null);
        setSubmitSuccess(false);

        try {
            await updateProjectsPage(data as any);
            setSubmitSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message ||
                "Failed to save Projects Page";
            setError(errorMessage);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const handleCancel = useCallback(() => {
        navigate("/dashboard");
    }, [navigate]);

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    const tabs: FormTab[] = [
        { id: "content", label: "Content", icon: "📝" },
        { id: "seo", label: "SEO", icon: "🔍" },
    ];

    return (
        <>
            {/* Success/Error Messages */}
            {submitSuccess && (
                <div className="max-w-6xl mx-auto mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <p className="text-sm font-medium text-green-800">
                            Projects Page updated successfully!
                        </p>
                    </div>
                </div>
            )}
            {error && (
                <div className="max-w-6xl mx-auto mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="flex items-center">
                        <span className="text-red-500 mr-2">✕</span>
                        <p className="text-sm font-medium text-red-800">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            <FormWrapper
                title="Edit Projects Page"
                subtitle="Manage your projects listing page content and SEO settings"
                isEditMode={true}
                form={form as any}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={false}
                contentType={"projectsPage" as any}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enableKeyboardShortcuts={true}
            >
                {/* Content Tab */}
                {activeTab === "content" && (
                    <div className="space-y-6">
                        <FormField
                            id="pageTitle"
                            label="Page Title"
                            helpText="The main title displayed on the projects page"
                        >
                            <Input
                                id="pageTitle"
                                type="text"
                                {...register("pageTitle")}
                                placeholder="Enter page title (e.g., Our Projects)"
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            id="heading"
                            label="Page Heading"
                            helpText="The heading displayed above the projects list"
                        >
                            <Input
                                id="heading"
                                type="text"
                                {...register("heading")}
                                placeholder="Enter page heading"
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            id="pageSubtitle"
                            label="Page Subtitle"
                            helpText="Optional subtitle or description for the page"
                        >
                            <textarea
                                id="pageSubtitle"
                                {...register("pageSubtitle")}
                                placeholder="Enter page subtitle or description"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                            />
                        </FormField>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === "seo" && (
                    <div className="space-y-6">
                        <FormField
                            id="seoTitle"
                            label="SEO Title"
                            helpText="Title for search engines (recommended: 50-60 characters)"
                        >
                            <Input
                                id="seoTitle"
                                type="text"
                                {...register("seoTitle")}
                                placeholder="SEO optimized title"
                                maxLength={60}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            id="seoDescription"
                            label="SEO Description"
                            helpText="Description for search engines (recommended: 150-160 characters)"
                        >
                            <textarea
                                id="seoDescription"
                                {...register("seoDescription")}
                                placeholder="SEO optimized description"
                                maxLength={160}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                            />
                        </FormField>

                        <div className="border-t pt-6">
                            <Controller
                                name="metaTags"
                                control={control}
                                render={({ field }) => (
                                    <MetaTagsInput
                                        value={field.value || []}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}
            </FormWrapper>
        </>
    );
}
