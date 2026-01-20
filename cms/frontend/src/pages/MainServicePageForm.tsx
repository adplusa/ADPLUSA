import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import ImageUploader, { type UploadedImage } from "../components/ImageUploader";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { seoSchema } from "../utils/validation";
import {
    getMainServicePage,
    updateMainServicePage,
} from "../services/mainServicePage.service";
import MetaTagsInput from "../components/MetaTagsInput";

// --- Validation Schemas ---

const imageSchema = z.object({
    url: z.string().optional(),
    alt: z.string().optional(),
});

const whyWorkWithUsItemSchema = z.object({
    icon: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

const mainServicePageSchema = z
    .object({
        _id: z.string().optional(),
        // Banner
        bannerImage: imageSchema.optional(),
        bannerTitle: z.string().optional(),
        // Page Content
        pageTitle: z.string().optional(),
        pageSubtitle: z.string().optional(),
        // Trust Icons Section
        showTrustIcons: z.boolean().default(true),
        trustIconsHeading: z.string().optional(),
        // Services Section
        servicesHeading: z.string().optional(),
        // Why Work With Us Section
        showWhyWorkWithUs: z.boolean().default(true),
        whyWorkWithUsHeading: z.string().optional(),
        whyWorkWithUsItems: z.array(whyWorkWithUsItemSchema).default([]),
        whyWorkWithUsImage: imageSchema.optional(),
        // Contact Form Section
        showContactForm: z.boolean().default(true),
        contactFormHeading: z.string().optional(),
        contactFormSubheading: z.string().optional(),
        // Timestamps
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .merge(seoSchema);

type MainServicePageFormData = z.infer<typeof mainServicePageSchema>;

/**
 * Image preview component with upload/remove functionality
 */
function FormImagePreview({
    url,
    onUpload,
    onRemove,
    folder = "main-service-page",
}: {
    url?: string;
    onUpload: (url: string) => void;
    onRemove: () => void;
    folder?: string;
}) {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpload = (images: UploadedImage[]) => {
        if (images.length > 0) {
            const img = images[0];
            const finalUrl = img.cdnUrl || img.cloudFrontUrl || img.url;
            onUpload(finalUrl);
            setIsEditing(false);
        }
    };

    return (
        <div className="space-y-4">
            {url ? (
                <div className="flex items-start gap-4">
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border">
                        <img
                            src={url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Upload className="mr-2 h-4 w-4" /> Change
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={onRemove}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
            )}

            {isEditing && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <ImageUploader
                        multiple={false}
                        maxFiles={1}
                        folder={folder}
                        onUploadComplete={handleUpload}
                    />
                </div>
            )}
        </div>
    );
}

export default function MainServicePageForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("banner");

    const form = useForm<MainServicePageFormData>({
        resolver: zodResolver(mainServicePageSchema) as any,
        defaultValues: {
            bannerImage: { url: "", alt: "" },
            bannerTitle: "",
            pageTitle: "",
            pageSubtitle: "",
            showTrustIcons: true,
            trustIconsHeading: "",
            servicesHeading: "",
            showWhyWorkWithUs: true,
            whyWorkWithUsHeading: "",
            whyWorkWithUsItems: [],
            whyWorkWithUsImage: { url: "", alt: "" },
            showContactForm: true,
            contactFormHeading: "",
            contactFormSubheading: "",
            seoTitle: "",
            seoDescription: "",
            metaTags: [],
        },
    });

    const {
        register,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = form;

    // Field Array for Why Work With Us items
    const {
        fields: whyWorkWithUsFields,
        append: appendWhyWorkWithUs,
        remove: removeWhyWorkWithUs,
    } = useFieldArray({ control, name: "whyWorkWithUsItems" });

    // Load Main Service Page Data
    const loadMainServicePage = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getMainServicePage();
            if (response.data) {
                reset({
                    ...response.data,
                    bannerImage: response.data.bannerImage || {
                        url: "",
                        alt: "",
                    },
                    whyWorkWithUsImage: response.data.whyWorkWithUsImage || {
                        url: "",
                        alt: "",
                    },
                    whyWorkWithUsItems: response.data.whyWorkWithUsItems || [],
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
                    "Failed to load Main Service Page";
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        loadMainServicePage();
    }, [loadMainServicePage]);

    const onSubmit = useCallback(async (data: MainServicePageFormData) => {
        setIsSubmitting(true);
        setError(null);
        setSubmitSuccess(false);

        try {
            await updateMainServicePage(data as any);
            setSubmitSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message ||
                "Failed to save Main Service Page";
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
        { id: "banner", label: "Banner", icon: "🖼️" },
        { id: "content", label: "Content", icon: "📝" },
        {
            id: "whyWorkWithUs",
            label: "Why Work With Us",
            icon: "✅",
            count: whyWorkWithUsFields.length,
        },
        { id: "contactForm", label: "Contact Form", icon: "📞" },
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
                            Main Service Page updated successfully!
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
                title="Edit Main Service Page"
                subtitle="Manage your main services page content, sections, and SEO settings"
                isEditMode={true}
                form={form as any}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={false}
                contentType={"mainServicePage" as any}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enableKeyboardShortcuts={true}
            >
                {/* Banner Tab */}
                {activeTab === "banner" && (
                    <div className="space-y-6">
                        <FormField id="bannerTitle" label="Banner Title">
                            <Input
                                id="bannerTitle"
                                type="text"
                                {...register("bannerTitle")}
                                placeholder="Enter banner title"
                                className="w-full"
                            />
                        </FormField>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Banner Image
                            </Label>
                            <FormImagePreview
                                url={watch("bannerImage.url")}
                                onUpload={(url) =>
                                    setValue("bannerImage.url", url, {
                                        shouldDirty: true,
                                    })
                                }
                                onRemove={() =>
                                    setValue("bannerImage.url", "", {
                                        shouldDirty: true,
                                    })
                                }
                                folder="main-service-page-banner"
                            />
                        </div>

                        <FormField
                            id="bannerImage.alt"
                            label="Banner Image Alt Text"
                        >
                            <Input
                                id="bannerImage.alt"
                                type="text"
                                {...register("bannerImage.alt")}
                                placeholder="Describe the banner image for accessibility"
                                className="w-full"
                            />
                        </FormField>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                    <div className="space-y-6">
                        <FormField id="pageTitle" label="Page Title">
                            <Input
                                id="pageTitle"
                                type="text"
                                {...register("pageTitle")}
                                placeholder="Enter page title"
                                className="w-full"
                            />
                        </FormField>

                        <FormField id="pageSubtitle" label="Page Subtitle">
                            <textarea
                                id="pageSubtitle"
                                {...register("pageSubtitle")}
                                placeholder="Enter page subtitle"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                            />
                        </FormField>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Trust Icons Section
                            </h3>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="showTrustIcons"
                                    {...register("showTrustIcons")}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <Label htmlFor="showTrustIcons">
                                    Show Trust Icons Section
                                </Label>
                            </div>
                            <FormField
                                id="trustIconsHeading"
                                label="Trust Icons Heading"
                            >
                                <Input
                                    id="trustIconsHeading"
                                    type="text"
                                    {...register("trustIconsHeading")}
                                    placeholder="Enter trust icons section heading"
                                    className="w-full"
                                />
                            </FormField>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Services Section
                            </h3>
                            <FormField
                                id="servicesHeading"
                                label="Services Heading"
                            >
                                <Input
                                    id="servicesHeading"
                                    type="text"
                                    {...register("servicesHeading")}
                                    placeholder="Enter services section heading"
                                    className="w-full"
                                />
                            </FormField>
                        </div>
                    </div>
                )}

                {/* Why Work With Us Tab */}
                {activeTab === "whyWorkWithUs" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="showWhyWorkWithUs"
                                {...register("showWhyWorkWithUs")}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <Label htmlFor="showWhyWorkWithUs">
                                Show Why Work With Us Section
                            </Label>
                        </div>

                        <FormField
                            id="whyWorkWithUsHeading"
                            label="Section Heading"
                        >
                            <Input
                                id="whyWorkWithUsHeading"
                                type="text"
                                {...register("whyWorkWithUsHeading")}
                                placeholder="Enter section heading"
                                className="w-full"
                            />
                        </FormField>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Image
                            </Label>
                            <FormImagePreview
                                url={watch("whyWorkWithUsImage.url")}
                                onUpload={(url) =>
                                    setValue("whyWorkWithUsImage.url", url, {
                                        shouldDirty: true,
                                    })
                                }
                                onRemove={() =>
                                    setValue("whyWorkWithUsImage.url", "", {
                                        shouldDirty: true,
                                    })
                                }
                                folder="main-service-page-why-work"
                            />
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Items
                                </h3>
                                <Button
                                    type="button"
                                    onClick={() =>
                                        appendWhyWorkWithUs({
                                            icon: "",
                                            title: "",
                                            description: "",
                                        })
                                    }
                                    className="flex items-center gap-1"
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" /> Add Item
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {whyWorkWithUsFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeWhyWorkWithUs(index)
                                            }
                                            className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormField
                                                id={`whyWorkWithUsItems.${index}.icon`}
                                                label="Icon (emoji or icon class)"
                                            >
                                                <Input
                                                    type="text"
                                                    {...register(
                                                        `whyWorkWithUsItems.${index}.icon` as const,
                                                    )}
                                                    placeholder="e.g., ✓ or fa-check"
                                                    className="w-full"
                                                />
                                            </FormField>
                                            <FormField
                                                id={`whyWorkWithUsItems.${index}.title`}
                                                label="Title"
                                                error={
                                                    errors.whyWorkWithUsItems?.[
                                                        index
                                                    ]?.title?.message
                                                }
                                            >
                                                <Input
                                                    type="text"
                                                    {...register(
                                                        `whyWorkWithUsItems.${index}.title` as const,
                                                    )}
                                                    placeholder="Enter item title"
                                                    className="w-full"
                                                />
                                            </FormField>
                                            <FormField
                                                id={`whyWorkWithUsItems.${index}.description`}
                                                label="Description"
                                                error={
                                                    errors.whyWorkWithUsItems?.[
                                                        index
                                                    ]?.description?.message
                                                }
                                            >
                                                <textarea
                                                    {...register(
                                                        `whyWorkWithUsItems.${index}.description` as const,
                                                    )}
                                                    placeholder="Enter item description"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                                />
                                            </FormField>
                                        </div>
                                    </div>
                                ))}

                                {whyWorkWithUsFields.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                        No items added yet. Click "Add Item" to
                                        add your first item.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Form Tab */}
                {activeTab === "contactForm" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="showContactForm"
                                {...register("showContactForm")}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <Label htmlFor="showContactForm">
                                Show Contact Form Section
                            </Label>
                        </div>

                        <FormField
                            id="contactFormHeading"
                            label="Contact Form Heading"
                        >
                            <Input
                                id="contactFormHeading"
                                type="text"
                                {...register("contactFormHeading")}
                                placeholder="Enter contact form heading"
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            id="contactFormSubheading"
                            label="Contact Form Subheading"
                        >
                            <textarea
                                id="contactFormSubheading"
                                {...register("contactFormSubheading")}
                                placeholder="Enter contact form subheading"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                            />
                        </FormField>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> The contact form will use
                                the same submission endpoint as the main contact
                                page. Form fields (name, email, phone, service,
                                message) are predefined.
                            </p>
                        </div>
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
