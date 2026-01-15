import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { seoSchema } from "../utils/validation";
import type { FAQ } from "../services/content.service";
import { getFAQ, updateFAQ } from "../services/content.service";
import PreviewModal from "../components/PreviewModal";

// Validation schemas
const faqItemSchema = z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
});

const faqCategorySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    chatLink: z.string().optional(),
    image: z
        .object({
            url: z.string(),
            darkModeUrl: z.string().optional(),
        })
        .optional(),
    faqs: z.array(faqItemSchema).optional(),
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
        resolver: zodResolver(faqSchema),
        defaultValues: {
            title: "",
            categories: [],
            seoTitle: "",
            seoDescription: "",
            customHeadTags: "",
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

    const {
        fields: categoryFields,
        append: appendCategory,
        remove: removeCategory,
    } = useFieldArray({
        control,
        name: "categories",
    });

    const watchSeoTitle = watch("seoTitle");
    const watchSeoDescription = watch("seoDescription");

    useEffect(() => {
        loadFAQ();
    }, []);

    const loadFAQ = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getFAQ();
            if (response.data) {
                reset(response.data as FAQFormData);
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message || "Failed to load FAQ";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
        [navigate]
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
            icon: "📋",
            count: categoryFields.length,
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
                form={form}
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
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    FAQ Categories
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Organize your FAQs into categories
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    appendCategory({
                                        title: "",
                                        description: "",
                                        chatLink: "",
                                        faqs: [],
                                    })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <span className="mr-2">+</span> Add Category
                            </button>
                        </div>

                        {categoryFields.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    No categories yet. Click "Add Category" to
                                    get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {categoryFields.map(
                                    (category, categoryIndex) => (
                                        <div
                                            key={category.id}
                                            className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-md font-medium text-gray-900">
                                                    Category {categoryIndex + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCategory(
                                                            categoryIndex
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    aria-label={`Remove category ${
                                                        categoryIndex + 1
                                                    }`}
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <FormField
                                                    id={`categories.${categoryIndex}.title`}
                                                    label="Category Title"
                                                >
                                                    <input
                                                        id={`categories.${categoryIndex}.title`}
                                                        type="text"
                                                        {...register(
                                                            `categories.${categoryIndex}.title` as const
                                                        )}
                                                        placeholder="Category title"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    />
                                                </FormField>

                                                <FormField
                                                    id={`categories.${categoryIndex}.description`}
                                                    label="Description"
                                                >
                                                    <textarea
                                                        id={`categories.${categoryIndex}.description`}
                                                        rows={2}
                                                        {...register(
                                                            `categories.${categoryIndex}.description` as const
                                                        )}
                                                        placeholder="Category description"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    />
                                                </FormField>

                                                <FormField
                                                    id={`categories.${categoryIndex}.chatLink`}
                                                    label="Chat Link"
                                                >
                                                    <input
                                                        id={`categories.${categoryIndex}.chatLink`}
                                                        type="text"
                                                        {...register(
                                                            `categories.${categoryIndex}.chatLink` as const
                                                        )}
                                                        placeholder="https://chat.example.com"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    />
                                                </FormField>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
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
                                    {watch("customHeadTags") && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 mb-1">
                                                Custom Head Tags:
                                            </p>
                                            <code className="block text-xs text-gray-600 bg-gray-50 p-2 rounded truncate font-mono">
                                                {watch("customHeadTags")}
                                            </code>
                                        </div>
                                    )}
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
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.seoTitle
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="SEO optimized title (50-60 characters)"
                                    />
                                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${
                                                (watchSeoTitle?.length || 0) >
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
                                                    100
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
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.seoDescription
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="SEO optimized description (150-160 characters)"
                                    />
                                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${
                                                (watchSeoDescription?.length ||
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
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </FormField>

                                <FormField
                                    id="customHeadTags"
                                    label="Custom Head Tags"
                                    helpText="Add custom meta tags, scripts, or link tags here. These will be injected into the <head> of the page."
                                    error={errors.customHeadTags?.message}
                                >
                                    <textarea
                                        id="customHeadTags"
                                        {...register("customHeadTags")}
                                        rows={5}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                        placeholder="<meta name='keywords' content='...' />"
                                    />
                                </FormField>
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
