import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageUploader from "../components/ImageUploader";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { slugSchema, urlSchema, seoSchema } from "../utils/validation";
import type { Project } from "../services/project.service";
import {
    createProject,
    updateProject,
    getProjectBySlug,
} from "../services/project.service";

// Quill configuration
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
];

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

// Validation schema for project form
const projectImageSchema = z.object({
    url: z.string().min(1, "Image URL is required"),
    alt: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
});

const projectDetailSchema = z.object({
    label: z.string().optional(),
    value: z.string().optional(),
    items: z.array(z.string()).optional(),
});

const projectSchema = z
    .object({
        _id: z.string().optional(),
        title: z.string().min(1, "Title is required"),
        slug: slugSchema,
        description: z.string().optional(),
        introText: z.string().optional(),
        moreContent: z.string().optional(),
        images: z.array(projectImageSchema).optional(),
        projectDetails: z.array(projectDetailSchema).optional(),
        category: z.string().optional(),
        featured: z.boolean(),
        link: urlSchema,
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .merge(seoSchema);

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("basic");

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            introText: "",
            moreContent: "",
            images: [],
            projectDetails: [],
            category: "",
            featured: false,
            link: "",
            seoTitle: "",
            seoDescription: "",
            customHeadTags: "",
        },
    });

    const {
        register,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = form;

    // Field array for project details
    const {
        fields: detailsFields,
        append: appendDetail,
        remove: removeDetail,
    } = useFieldArray({
        control,
        name: "projectDetails",
    });

    // Watch title for auto-slug generation
    const watchTitle = watch("title");
    const watchSeoTitle = watch("seoTitle");
    const watchSeoDescription = watch("seoDescription");

    useEffect(() => {
        if (!isEditMode && watchTitle) {
            setValue("slug", generateSlug(watchTitle));
        }
    }, [watchTitle, isEditMode, setValue]);

    useEffect(() => {
        if (isEditMode && id) {
            loadProject(id);
        }
    }, [id, isEditMode]);

    const loadProject = async (slug: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProjectBySlug(slug);
            reset(response.data as ProjectFormData);
        } catch (err: any) {
            setError(
                err.response?.data?.error?.message || "Failed to load project"
            );
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = useCallback(
        async (data: ProjectFormData) => {
            setIsSubmitting(true);
            setError(null);
            setSuccess(false);

            try {
                if (isEditMode && data._id) {
                    await updateProject(data._id, data as Project);
                } else {
                    await createProject(data as Project);
                }
                setSuccess(true);
                setTimeout(() => navigate("/dashboard/projects"), 1500);
            } catch (err: any) {
                setError(
                    err.response?.data?.error?.message ||
                        "Failed to save project"
                );
                throw err; // Re-throw to let FormWrapper know submission failed
            } finally {
                setIsSubmitting(false);
            }
        },
        [isEditMode, navigate]
    );

    const handleCancel = useCallback(() => {
        navigate("/dashboard/projects");
    }, [navigate]);

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    const tabs: FormTab[] = [
        { id: "basic", label: "Basic Info", icon: "📝" },
        { id: "content", label: "Content", icon: "📄" },
        {
            id: "details",
            label: "Project Details",
            icon: "📋",
            count: detailsFields.length,
        },
        { id: "images", label: "Images", icon: "🖼️" },
        { id: "seo", label: "SEO", icon: "🔍" },
    ];

    return (
        <>
            {/* Success Message */}
            {success && (
                <div className="max-w-6xl mx-auto mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <p className="text-sm font-medium text-green-800">
                            Project {isEditMode ? "updated" : "created"}{" "}
                            successfully!
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
                title={isEditMode ? "Edit Project" : "Create New Project"}
                subtitle={
                    isEditMode
                        ? "Update the project details below"
                        : "Fill in the details to create a new project"
                }
                isEditMode={isEditMode}
                form={form}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={true}
                contentType="project"
                contentId={id}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enableKeyboardShortcuts={true}
            >
                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <FormField
                                id="title"
                                label="Title"
                                required
                                error={errors.title?.message}
                            >
                                <input
                                    id="title"
                                    type="text"
                                    {...register("title")}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                        errors.title
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="e.g., Modern Villa Design"
                                    aria-invalid={
                                        errors.title ? "true" : "false"
                                    }
                                    aria-describedby={
                                        errors.title ? "title-error" : undefined
                                    }
                                />
                            </FormField>

                            {/* Slug */}
                            <FormField
                                id="slug"
                                label="Slug"
                                required
                                error={errors.slug?.message}
                                helpText={`URL: /projects/${
                                    watch("slug") || "your-slug"
                                }`}
                            >
                                <input
                                    id="slug"
                                    type="text"
                                    {...register("slug")}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm ${
                                        errors.slug
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="modern-villa-design"
                                    aria-invalid={
                                        errors.slug ? "true" : "false"
                                    }
                                    aria-describedby={
                                        errors.slug ? "slug-error" : "slug-help"
                                    }
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <FormField id="category" label="Category">
                                <input
                                    id="category"
                                    type="text"
                                    {...register("category")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="e.g., Residential, Commercial"
                                />
                            </FormField>

                            {/* External Link */}
                            <FormField
                                id="link"
                                label="External Link"
                                error={errors.link?.message}
                            >
                                <input
                                    id="link"
                                    type="text"
                                    {...register("link")}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                        errors.link
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="https://..."
                                    aria-invalid={
                                        errors.link ? "true" : "false"
                                    }
                                />
                            </FormField>
                        </div>

                        {/* Featured Checkbox */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="featured"
                                {...register("featured")}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="featured"
                                className="text-sm font-medium text-gray-700"
                            >
                                Featured Project
                                <span className="block text-xs text-gray-500 font-normal">
                                    Featured projects appear on the homepage
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                    <div className="space-y-6">
                        {/* Short Description */}
                        <FormField id="description" label="Short Description">
                            <textarea
                                id="description"
                                {...register("description")}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Brief description for listings..."
                            />
                        </FormField>

                        {/* Intro Text */}
                        <FormField
                            id="introText"
                            label="Introduction Text"
                            helpText="This appears as the main paragraph on the project detail page"
                        >
                            <textarea
                                id="introText"
                                {...register("introText")}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Detailed introduction paragraph..."
                            />
                        </FormField>

                        {/* More Content (Rich Text) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Content
                            </label>
                            <Controller
                                name="moreContent"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ReactQuill
                                        theme="snow"
                                        value={value || ""}
                                        onChange={onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Add scope of work, additional details..."
                                        className="bg-white"
                                    />
                                )}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                This content appears in an expandable section
                            </p>
                        </div>
                    </div>
                )}

                {/* Project Details Tab */}
                {activeTab === "details" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Project Details
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Add key-value pairs like Location, Area,
                                    Client, etc.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    appendDetail({ label: "", value: "" })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <span className="mr-2">+</span> Add Detail
                            </button>
                        </div>

                        {detailsFields.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    No details yet. Click "Add Detail" to get
                                    started.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Common details: Location, Area, Year, Client
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {detailsFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200"
                                    >
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                {...register(
                                                    `projectDetails.${index}.label`
                                                )}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Label (e.g., Location)"
                                                aria-label={`Detail ${
                                                    index + 1
                                                } label`}
                                            />
                                            <input
                                                type="text"
                                                {...register(
                                                    `projectDetails.${index}.value`
                                                )}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Value (e.g., Chicago, IL)"
                                                aria-label={`Detail ${
                                                    index + 1
                                                } value`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDetail(index)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            aria-label={`Remove detail ${
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

                {/* Images Tab */}
                {activeTab === "images" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Project Images
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Upload images for the project gallery. The first
                                image will be used as the main image.
                            </p>
                            <Controller
                                name="images"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ImageUploader
                                        multiple={true}
                                        initialImages={
                                            value?.map((img) => ({
                                                url: img.url,
                                                width: img.width,
                                                height: img.height,
                                                status: "success" as const,
                                            })) || []
                                        }
                                        onUploadComplete={(images) => {
                                            const imageData = images.map(
                                                (img) => ({
                                                    url: img.url,
                                                    alt: "",
                                                    width: img.width,
                                                    height: img.height,
                                                })
                                            );
                                            onChange(imageData);
                                        }}
                                        onImagesReorder={(images) => {
                                            const imageData = images.map(
                                                (img) => ({
                                                    url: img.url,
                                                    alt: "",
                                                    width: img.width,
                                                    height: img.height,
                                                })
                                            );
                                            onChange(imageData);
                                        }}
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
                                            "Page Title"}
                                    </p>
                                    <p className="text-green-700 text-sm">
                                        https://yoursite.com/projects/
                                        {watch("slug") || "page-slug"}
                                    </p>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {watchSeoDescription ||
                                            watch("description") ||
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
                                        aria-invalid={
                                            errors.seoTitle ? "true" : "false"
                                        }
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
                                        aria-invalid={
                                            errors.seoDescription
                                                ? "true"
                                                : "false"
                                        }
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
        </>
    );
}
