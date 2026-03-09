import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { seoSchema } from "../utils/validation";
import type { FAQ } from "../services/content.service";
import { getFAQ, updateFAQ } from "../services/content.service";
import PreviewModal from "../components/PreviewModal";
import { FAQEditor } from "../components/FAQEditor";
import MetaTagsInput from "../components/MetaTagsInput";

// Validation schemas
const faqItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
});

const faqCategorySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    chatLink: z.string().optional(),
    faqs: z.array(faqItemSchema),
});

const faqSchema = z
    .object({
        _id: z.string().optional(),
        title: z.string().optional(),
        categories: z.array(faqCategorySchema).optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .merge(seoSchema);

type FAQFormData = z.infer<typeof faqSchema>;

export default function FAQForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("general");

    const form = useForm<FAQFormData>({
        resolver: zodResolver(faqSchema) as any,
        defaultValues: {
            title: "",
            categories: [],
            seoTitle: "",
            seoDescription: "",
            customHeadTags: "",
            metaTags: [],
        },
    });

    const {
        register,
        control,
        reset,
        watch,
        getValues,
        formState: { errors },
    } = form;

    const watchSeoTitle = watch("seoTitle");
    const watchSeoDescription = watch("seoDescription");

    const loadFAQ = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getFAQ();
            if (response) {
                reset({
                    ...response,
                    metaTags: (response as any).metaTags || [],
                } as any);
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message || "Failed to load FAQ";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        loadFAQ();
    }, [loadFAQ]);

    const onSubmit = useCallback(
        async (data: FAQFormData) => {
            setIsSubmitting(true);
            setError(null);
            setSubmitSuccess(false);

            try {
                await updateFAQ(data as FAQ);
                setSubmitSuccess(true);

                setTimeout(() => {
                    navigate("/dashboard/faq");
                }, 1500);
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.error?.message || "Failed to save FAQ";
                setError(errorMessage);
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [navigate],
    );

    const handleCancel = useCallback(() => {
        navigate("/dashboard/faq");
    }, [navigate]);

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    const handlePreview = useCallback(() => {
        setIsPreviewOpen(true);
    }, []);

    const tabs: FormTab[] = [
        { id: "general", label: "General", icon: "📝" },
        {
            id: "categories",
            label: "Categories",
            icon: "❓",
            count: watch("categories")?.length || 0,
        },
        { id: "seo", label: "SEO", icon: "🔍" },
    ];

    return (
        <>
            {/* Success Message */}
            {submitSuccess && (
                <div className="max-w-6xl mx-auto mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <p className="text-sm font-medium text-green-800">
                            FAQ updated successfully!
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
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
                title="Edit FAQ"
                subtitle="Manage frequently asked questions and categories"
                isEditMode={true}
                form={form as any}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={true}
                contentType="faq"
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enableKeyboardShortcuts={true}
            >
                {/* General Tab */}
                {activeTab === "general" && (
                    <div className="space-y-6">
                        <FormField id="title" label="Page Title">
                            <input
                                id="title"
                                type="text"
                                {...register("title")}
                                placeholder="Frequently Asked Questions"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        </FormField>

                        {/* Preview Button */}
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handlePreview}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                Preview FAQ
                            </button>
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === "categories" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                FAQ Categories
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Organize your questions into categories. Each
                                category can have multiple questions and
                                answers.
                            </p>

                            <Controller
                                name="categories"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <FAQEditor
                                        value={value || []}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === "seo" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Search Engine Optimization
                            </h3>

                            {/* SEO Preview */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                                <p className="text-xs text-gray-500 mb-2">
                                    Search Result Preview
                                </p>
                                <div className="space-y-1">
                                    <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                                        {watchSeoTitle ||
                                            watch("title") ||
                                            "FAQ Page Title"}
                                    </p>
                                    <p className="text-green-700 text-sm">
                                        https://yoursite.com/faq
                                    </p>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {watchSeoDescription ||
                                            "Page description will appear here..."}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    id="seoTitle"
                                    label="SEO Title"
                                    maxLength={60}
                                    currentLength={watchSeoTitle?.length || 0}
                                    error={errors.seoTitle?.message}
                                >
                                    <input
                                        id="seoTitle"
                                        type="text"
                                        {...register("seoTitle")}
                                        maxLength={60}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.seoTitle
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                            }`}
                                        placeholder="SEO optimized title (50-60 characters)"
                                    />
                                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${(watchSeoTitle?.length || 0) >
                                                    60
                                                    ? "bg-red-500"
                                                    : (watchSeoTitle?.length ||
                                                        0) > 50
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500"
                                                }`}
                                            style={{
                                                width: `${Math.min(
                                                    ((watchSeoTitle?.length ||
                                                        0) /
                                                        60) *
                                                    100,
                                                    100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </FormField>

                                <FormField
                                    id="seoDescription"
                                    label="SEO Description"
                                    maxLength={160}
                                    currentLength={
                                        watchSeoDescription?.length || 0
                                    }
                                    error={errors.seoDescription?.message}
                                >
                                    <textarea
                                        id="seoDescription"
                                        {...register("seoDescription")}
                                        maxLength={160}
                                        rows={3}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.seoDescription
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                            }`}
                                        placeholder="SEO optimized description (150-160 characters)"
                                    />
                                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${(watchSeoDescription?.length ||
                                                    0) > 160
                                                    ? "bg-red-500"
                                                    : (watchSeoDescription?.length ||
                                                        0) > 150
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500"
                                                }`}
                                            style={{
                                                width: `${Math.min(
                                                    ((watchSeoDescription?.length ||
                                                        0) /
                                                        160) *
                                                    100,
                                                    100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </FormField>

                                <Controller
                                    name="metaTags"
                                    control={control}
                                    render={({ field }) => (
                                        <MetaTagsInput
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            disabled={isSubmitting}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </FormWrapper>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                title="FAQ"
                contentType="faq"
                data={getValues()}
            />
        </>
    );
}
