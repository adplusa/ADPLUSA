import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "react-quill-new/dist/quill.snow.css";
import ImageUploader from "../components/ImageUploader";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { slugSchema, seoSchema } from "../utils/validation";
import type { Service } from "../services/service.service";
import {
    createService,
    updateService,
    getServiceBySlug,
} from "../services/service.service";
import MetaTagsInput from "../components/MetaTagsInput";

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

// Validation schemas
const serviceImageSchema = z.object({
    url: z.string().min(1, "Image URL is required"),
    alt: z.string().optional(),
});

const serviceItemSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: serviceImageSchema.optional(),
    link: z.string().optional(),
    isExternal: z.boolean().optional(),
    order: z.number().optional(),
});

const keyActivitySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
});

const serviceFeatureSchema = z.object({
    title: z.string().min(1, "Feature title is required"),
    description: z.string().min(1, "Feature description is required"),
});

const serviceSchema = z
    .object({
        _id: z.string().optional(),
        title: z.string().min(1, "Title is required"),
        slug: slugSchema,
        description: z.string().optional(),
        content: z.string().optional(),
        bannerImage: serviceImageSchema.optional(),
        displayImage: serviceImageSchema.optional(),
        servicesList: z.array(serviceItemSchema).optional(),
        keyActivities: z.array(keyActivitySchema).optional(),
        features: z.array(serviceFeatureSchema).optional(),
        image: serviceImageSchema.optional(),
        order: z.number().min(0, "Order must be a positive number").optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .merge(seoSchema);

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServiceForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("basic");

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            content: "",
            servicesList: [],
            keyActivities: [],
            features: [],
            order: 0,
            seoTitle: "",
            seoDescription: "",
            customHeadTags: "",
            metaTags: [],
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

    // Field arrays for nested data
    const {
        fields: servicesListFields,
        append: appendService,
        remove: removeService,
    } = useFieldArray({
        control,
        name: "servicesList",
    });

    const {
        fields: keyActivitiesFields,
        append: appendActivity,
        remove: removeActivity,
    } = useFieldArray({
        control,
        name: "keyActivities",
    });

    const {
        fields: featuresFields,
        append: appendFeature,
        remove: removeFeature,
    } = useFieldArray({
        control,
        name: "features",
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
            loadService(id);
        }
    }, [id, isEditMode]);

    const loadService = async (slug: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getServiceBySlug(slug);
            reset(response.data as ServiceFormData);
        } catch (err: any) {
            setError(
                err.response?.data?.error?.message || "Failed to load service"
            );
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = useCallback(
        async (data: ServiceFormData) => {
            setIsSubmitting(true);
            setError(null);
            setSuccess(false);

            try {
                if (isEditMode && data._id) {
                    await updateService(data._id, data as Service);
                } else {
                    await createService(data as Service);
                }
                setSuccess(true);
                setTimeout(() => navigate("/dashboard/services"), 1500);
            } catch (err: any) {
                setError(
                    err.response?.data?.error?.message ||
                        "Failed to save service"
                );
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [isEditMode, navigate]
    );

    const handleCancel = useCallback(() => {
        navigate("/dashboard/services");
    }, [navigate]);

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    const tabs: FormTab[] = [
        { id: "basic", label: "Basic Info", icon: "📝" },
        {
            id: "services",
            label: "Services List",
            icon: "📋",
            count: servicesListFields.length,
        },
        {
            id: "activities",
            label: "Key Activities",
            icon: "⚡",
            count: keyActivitiesFields.length,
        },
        {
            id: "features",
            label: "Features",
            icon: "✨",
            count: featuresFields.length,
        },
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
                            Service {isEditMode ? "updated" : "created"}{" "}
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
                title={isEditMode ? "Edit Service" : "Create New Service"}
                subtitle={
                    isEditMode
                        ? "Update the service details below"
                        : "Fill in the details to create a new service"
                }
                isEditMode={isEditMode}
                form={form}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={true}
                contentType="service"
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
                                    placeholder="e.g., Drafting to CAD Services"
                                    aria-invalid={
                                        errors.title ? "true" : "false"
                                    }
                                />
                            </FormField>

                            {/* Slug */}
                            <FormField
                                id="slug"
                                label="Slug"
                                required
                                error={errors.slug?.message}
                                helpText={`URL: /services/${
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
                                    placeholder="drafting-to-cad"
                                    aria-invalid={
                                        errors.slug ? "true" : "false"
                                    }
                                />
                            </FormField>
                        </div>

                        {/* Description */}
                        <FormField id="description" label="Short Description">
                            <textarea
                                id="description"
                                {...register("description")}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Brief description of the service..."
                            />
                        </FormField>

                        {/* Banner Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banner Image
                            </label>
                            <Controller
                                name="bannerImage"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ImageUploader
                                        multiple={false}
                                        initialImages={
                                            value?.url
                                                ? [
                                                      {
                                                          url: value.url,
                                                          status: "success" as const,
                                                      },
                                                  ]
                                                : []
                                        }
                                        onUploadComplete={(images) => {
                                            if (images.length > 0) {
                                                onChange({
                                                    url: images[0].url,
                                                    alt: "Banner",
                                                });
                                            } else {
                                                onChange(undefined);
                                            }
                                        }}
                                    />
                                )}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Recommended size: 3780x1340px for best display
                            </p>
                        </div>

                        {/* Display Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Image
                            </label>
                            <Controller
                                name="displayImage"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ImageUploader
                                        multiple={false}
                                        initialImages={
                                            value?.url
                                                ? [
                                                    {
                                                        url: value.url,
                                                        status: "success" as const,
                                                    },
                                                ]
                                                : []
                                        }
                                        onUploadComplete={(images) => {
                                            if (images.length > 0) {
                                                onChange({
                                                    url: images[0].url,
                                                    alt: "Display",
                                                });
                                            } else {
                                                onChange(undefined);
                                            }
                                        }}
                                    />
                                )}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This image is used on the homepage and main services page. Recommended size: 800x600px.
                            </p>
                        </div>

                        {/* Order */}
                        <FormField
                            id="order"
                            label="Display Order"
                            className="w-32"
                        >
                            <input
                                id="order"
                                type="number"
                                min="0"
                                {...register("order", { valueAsNumber: true })}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const filteredValue = value.replace(/[^0-9]/g, ''); // Keep only digits
                                    const numericValue = Math.max(0, parseInt(filteredValue, 10) || 0);
                                    setValue("order", numericValue);
                                }}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="0"
                            />
                        </FormField>
                    </div>
                )}

                {/* Services List Tab */}
                {activeTab === "services" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Services List
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Add service items with descriptions and
                                    images
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    appendService({
                                        title: "",
                                        description: "",
                                        order: servicesListFields.length,
                                    })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <span className="mr-2">+</span> Add Service Item
                            </button>
                        </div>

                        {servicesListFields.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    No service items yet. Click "Add Service
                                    Item" to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {servicesListFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-gray-700">
                                                Service Item #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeService(index)
                                                }
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                aria-label={`Remove service item ${
                                                    index + 1
                                                }`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                id={`servicesList.${index}.title`}
                                                label="Title"
                                            >
                                                <input
                                                    id={`servicesList.${index}.title`}
                                                    type="text"
                                                    {...register(
                                                        `servicesList.${index}.title`
                                                    )}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Service item title"
                                                />
                                            </FormField>
                                            <FormField
                                                id={`servicesList.${index}.link`}
                                                label="Link (optional)"
                                            >
                                                <input
                                                    id={`servicesList.${index}.link`}
                                                    type="text"
                                                    {...register(
                                                        `servicesList.${index}.link`
                                                    )}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="/path or https://..."
                                                />
                                            </FormField>
                                        </div>
                                        <div className="mt-4">
                                            <FormField
                                                id={`servicesList.${index}.description`}
                                                label="Description"
                                            >
                                                <textarea
                                                    id={`servicesList.${index}.description`}
                                                    {...register(
                                                        `servicesList.${index}.description`
                                                    )}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Describe this service item..."
                                                />
                                            </FormField>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Image
                                            </label>
                                            <Controller
                                                name={`servicesList.${index}.image`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                }) => (
                                                    <ImageUploader
                                                        multiple={false}
                                                        initialImages={
                                                            value?.url
                                                                ? [
                                                                      {
                                                                          url: value.url,
                                                                          status: "success" as const,
                                                                      },
                                                                  ]
                                                                : []
                                                        }
                                                        onUploadComplete={(
                                                            images
                                                        ) => {
                                                            if (
                                                                images.length >
                                                                0
                                                            ) {
                                                                onChange({
                                                                    url: images[0]
                                                                        .url,
                                                                    alt: "",
                                                                });
                                                            } else {
                                                                onChange(
                                                                    undefined
                                                                );
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Key Activities Tab */}
                {activeTab === "activities" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Key Activities
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Add key activities and outcomes for this
                                    service
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    appendActivity({
                                        title: "",
                                        description: "",
                                        order: keyActivitiesFields.length,
                                    })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <span className="mr-2">+</span> Add Activity
                            </button>
                        </div>

                        {keyActivitiesFields.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    No activities yet. Click "Add Activity" to
                                    get started.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {keyActivitiesFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">
                                                Activity #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeActivity(index)
                                                }
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                aria-label={`Remove activity ${
                                                    index + 1
                                                }`}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            {...register(
                                                `keyActivities.${index}.title`
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                                            placeholder="Activity title"
                                            aria-label={`Activity ${
                                                index + 1
                                            } title`}
                                        />
                                        <textarea
                                            {...register(
                                                `keyActivities.${index}.description`
                                            )}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Activity description..."
                                            aria-label={`Activity ${
                                                index + 1
                                            } description`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Features Tab */}
                {activeTab === "features" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Features / Why Work With Us
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Add features or reasons to work with you
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    appendFeature({
                                        title: "",
                                        description: "",
                                    })
                                }
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <span className="mr-2">+</span> Add Feature
                            </button>
                        </div>

                        {featuresFields.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    No features yet. Click "Add Feature" to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {featuresFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">
                                                Feature #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFeature(index)
                                                }
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                aria-label={`Remove feature ${
                                                    index + 1
                                                }`}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <FormField
                                            id={`features.${index}.title`}
                                            label="Title"
                                            required
                                            error={
                                                errors.features?.[index]?.title
                                                    ?.message
                                            }
                                        >
                                            <input
                                                id={`features.${index}.title`}
                                                type="text"
                                                {...register(
                                                    `features.${index}.title`
                                                )}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                    errors.features?.[index]
                                                        ?.title
                                                        ? "border-red-300 bg-red-50"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Feature title"
                                            />
                                        </FormField>
                                        <div className="mt-2">
                                            <FormField
                                                id={`features.${index}.description`}
                                                label="Description"
                                                required
                                                error={
                                                    errors.features?.[index]
                                                        ?.description?.message
                                                }
                                            >
                                                <textarea
                                                    id={`features.${index}.description`}
                                                    {...register(
                                                        `features.${index}.description`
                                                    )}
                                                    rows={2}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                        errors.features?.[index]
                                                            ?.description
                                                            ? "border-red-300 bg-red-50"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Feature description..."
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
                                        {watchSeoTitle ||
                                            watch("title") ||
                                            "Page Title"}
                                    </p>
                                    <p className="text-green-700 text-sm">
                                        https://yoursite.com/services/
                                        {watch("slug") || "page-slug"}
                                    </p>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {watchSeoDescription ||
                                            watch("description") ||
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
        </>
    );
}
