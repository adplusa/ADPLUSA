import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { seoSchema } from "../utils/validation";
import { getAbout, updateAbout } from "../services/content.service";
import PreviewModal from "../components/PreviewModal";

// Validation schemas
const anchorLinkSchema = z.object({
    label: z.string().optional(),
    targetId: z.string().optional(),
});

const imageSchema = z
    .object({
        url: z.string().optional(),
        darkModeUrl: z.string().optional(),
    })
    .optional();

const sectionSchema = z.object({
    sectionId: z.string().optional(),
    title: z.string().optional(),
    body: z.string().optional(),
    image: imageSchema,
});

const aboutSchema = z
    .object({
        _id: z.string().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        allowLightHeading: z.string().optional(),
        allowUsHeading: z.string().optional(),
        allowRightHeading: z.string().optional(),
        paragraph: z.string().optional(),
        anchorLinks: z.array(anchorLinkSchema).optional(),
        sections: z.array(sectionSchema).optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .merge(seoSchema);

type AboutFormData = z.infer<typeof aboutSchema>;

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

export default function AboutForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("headings");

    const form = useForm<AboutFormData>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            allowLightHeading: "",
            allowUsHeading: "",
            allowRightHeading: "",
            paragraph: "",
            anchorLinks: [],
            sections: [],
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
        fields: anchorFields,
        append: appendAnchor,
        remove: removeAnchor,
    } = useFieldArray({
        control,
        name: "anchorLinks",
    });

    const {
        fields: sectionFields,
        append: appendSection,
        remove: removeSection,
    } = useFieldArray({
        control,
        name: "sections",
    });

    const watchSeoTitle = watch("seoTitle");
    const watchSeoDescription = watch("seoDescription");

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAbout();
            if (response.data) {
                reset(response.data as AboutFormData);
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message ||
                "Failed to load About page";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = useCallback(
        async (data: AboutFormData) => {
            setIsSubmitting(true);
            setError(null);
            setSubmitSuccess(false);

            try {
                await updateAbout(data as any);
                setSubmitSuccess(true);

                setTimeout(() => {
                    navigate("/dashboard/about");
                }, 1500);
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.error?.message ||
                    "Failed to save About page";
                setError(errorMessage);
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [navigate]
    );

    const handleCancel = useCallback(() => {
        navigate("/dashboard/about");
    }, [navigate]);

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    const handlePreview = useCallback(() => {
        setIsPreviewOpen(true);
    }, []);

    const tabs: FormTab[] = [
        { id: "headings", label: "Headings", icon: "📝" },
        { id: "content", label: "Content", icon: "📄" },
        {
            id: "links",
            label: "Anchor Links",
            icon: "🔗",
            count: anchorFields.length,
        },
        {
            id: "sections",
            label: "Sections",
            icon: "📋",
            count: sectionFields.length,
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
                            About page updated successfully!
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
                title="Edit About Page"
                subtitle="Manage your about page content and sections"
                isEditMode={true}
                form={form}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={true}
                contentType="about"
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enableKeyboardShortcuts={true}
            >
                {/* Headings Tab */}
                {activeTab === "headings" && (
                    <div className="space-y-6">
                        <FormField
                            id="allowLightHeading"
                            label="Allow Light Heading"
                        >
                            <input
                                id="allowLightHeading"
                                type="text"
                                {...register("allowLightHeading")}
                                placeholder="Enter heading"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        </FormField>

                        <FormField id="allowUsHeading" label="Allow Us Heading">
                            <input
                                id="allowUsHeading"
                                type="text"
                                {...register("allowUsHeading")}
                                placeholder="Enter heading"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        </FormField>

                        <FormField
                            id="allowRightHeading"
                            label="Allow Right Heading"
                        >
                            <input
                                id="allowRightHeading"
                                type="text"
                                {...register("allowRightHeading")}
                                placeholder="Enter heading"
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
                                Preview About Page
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paragraph
                            </label>
                            <Controller
                                name="paragraph"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ReactQuill
                                        theme="snow"
                                        value={value || ""}
                                        onChange={onChange}
                                        modules={quillModules}
                                        className="bg-white"
                                        placeholder="Enter the main paragraph content..."
                                    />
                                )}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                This is the main content paragraph for the about
                                page
                            </p>
                        </div>
                    </div>
                )}

                {/* Anchor Links Tab */}
                {activeTab === "links" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Anchor Links
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Add navigation links to page sections
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    appendAnchor({ label: "", targetId: "" })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <span className="mr-2">+</span> Add Link
                            </button>
                        </div>

                        {anchorFields.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    No anchor links yet. Click "Add Link" to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {anchorFields.map((anchor, index) => (
                                    <div
                                        key={anchor.id}
                                        className="flex gap-3 items-center bg-gray-50 rounded-lg p-3 border border-gray-200"
                                    >
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                {...register(
                                                    `anchorLinks.${index}.label` as const
                                                )}
                                                placeholder="Link label"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                aria-label={`Anchor link ${
                                                    index + 1
                                                } label`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                {...register(
                                                    `anchorLinks.${index}.targetId` as const
                                                )}
                                                placeholder="Target ID (e.g., #section-1)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                aria-label={`Anchor link ${
                                                    index + 1
                                                } target ID`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAnchor(index)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            aria-label={`Remove anchor link ${
                                                index + 1
                                            }`}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Sections Tab */}
                {activeTab === "sections" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Sections
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Add content sections to the about page
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    appendSection({
                                        sectionId: "",
                                        title: "",
                                        body: "",
                                        image: {
                                            url: "",
                                            darkModeUrl: "",
                                        },
                                    })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <span className="mr-2">+</span> Add Section
                            </button>
                        </div>

                        {sectionFields.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    No sections yet. Click "Add Section" to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {sectionFields.map((section, index) => (
                                    <div
                                        key={section.id}
                                        className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-md font-medium text-gray-900">
                                                Section {index + 1}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSection(index)
                                                }
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                aria-label={`Remove section ${
                                                    index + 1
                                                }`}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <FormField
                                                id={`sections.${index}.sectionId`}
                                                label="Section ID"
                                                helpText="Used for anchor link navigation"
                                            >
                                                <input
                                                    id={`sections.${index}.sectionId`}
                                                    type="text"
                                                    {...register(
                                                        `sections.${index}.sectionId` as const
                                                    )}
                                                    placeholder="section-id"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
                                                />
                                            </FormField>

                                            <FormField
                                                id={`sections.${index}.title`}
                                                label="Title"
                                            >
                                                <input
                                                    id={`sections.${index}.title`}
                                                    type="text"
                                                    {...register(
                                                        `sections.${index}.title` as const
                                                    )}
                                                    placeholder="Section title"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                />
                                            </FormField>

                                            <FormField
                                                id={`sections.${index}.body`}
                                                label="Body"
                                            >
                                                <textarea
                                                    id={`sections.${index}.body`}
                                                    rows={4}
                                                    {...register(
                                                        `sections.${index}.body` as const
                                                    )}
                                                    placeholder="Section content"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                />
                                            </FormField>
                                        </div>
                                    </div>
                                ))}
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
                                        {watchSeoTitle || "About Us"}
                                    </p>
                                    <p className="text-green-700 text-sm">
                                        https://yoursite.com/about
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
                title="About Page"
                contentType="about"
                data={getValues()}
            />
        </>
    );
}
