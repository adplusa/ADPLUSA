import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import ImageUploader, { type UploadedImage } from "../components/ImageUploader";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { seoSchema } from "../utils/validation";
import { getHomepage, updateHomepage } from "../services/homepage.service";
import PreviewModal from "../components/PreviewModal";
import MetaTagsInput from "../components/MetaTagsInput";

// --- Validation Schemas ---

const imageSchema = z.object({
    url: z.string().optional(), // Made optional to be lenient
    alt: z.string().optional(),
});

const slideSchema = z.object({
    image: imageSchema,
    order: z.number().default(1),
});

const trustIconSchema = z.object({
    image: imageSchema,
    number: z.string().min(1, "Number is required"),
    name: z.string().min(1, "Name is required"),
    order: z.number().default(1),
});

const serviceBoxSchema = z.object({
    url: z.string().min(1, "URL is required"),
    image: imageSchema,
    title: z.string().min(1, "Title is required"),
    order: z.number().default(1),
});

const technologyImageSchema = z.object({
    image: imageSchema,
    order: z.number().default(1),
});

const processStepSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: imageSchema,
    order: z.number().default(1),
});

// Wrapper for array of strings to work nicely with useFieldArray
const sliderTextObjectSchema = z.object({
    text: z.string().min(1, "Text is required"),
});

const founderSlideSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    descriptionTwo: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    achievements: z.string().optional(),
    partnerLabel: z.string().optional(),
    partner: z.string().optional(),
    image: imageSchema,
    order: z.number().default(1),
});

const homepageSchema = z
    .object({
        _id: z.string().optional(),
        // Hero
        sliderTitle: z.string().optional(),
        slides: z.array(slideSchema).default([]),
        // Trust Icons
        trustIconsHeading: z.string().optional(),
        trustIcons: z.array(trustIconSchema).default([]),
        // Services
        serviceHeading: z.string().optional(),
        serviceBoxes: z.array(serviceBoxSchema).default([]),
        serviceCta: z.string().optional(),
        // Technology
        technologyHeading: z.string().optional(),
        technologyImages: z.array(technologyImageSchema).default([]),
        // Process
        workingProcessHeading: z.string().optional(),
        workingProcessSubHeading: z.string().optional(),
        processSteps: z.array(processStepSchema).default([]),
        // Marquee

        sliderTextsObjects: z.array(sliderTextObjectSchema).default([]), // Helper for sliderTexts
        // About
        aboutLightHeading: z.string().optional(),
        aboutUsHeading: z.string().optional(),
        aboutRightHeading: z.string().optional(),
        aboutParagraph: z.string().optional(),
        aboutCtaButton: z.string().optional(),
        aboutImages: z.array(imageSchema).default([]),
        aboutVideo: z.object({ url: z.string().optional() }).optional(),
        peopleText: z.string().optional(),
        founderSlides: z.array(founderSlideSchema).default([]),
        // Contact
        contactImage: imageSchema.optional(),
        contactTitle: z.string().optional(),
        contactButton: z.string().optional(),

        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .merge(seoSchema);

type HomepageFormData = z.infer<typeof homepageSchema>;

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

function FormImagePreview({
    url,
    onUpload,
    onRemove,
    folder = "homepage",
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

export default function HomepageForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("hero");

    const form = useForm<HomepageFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(homepageSchema) as any,
        defaultValues: {
            slides: [],
            trustIcons: [],
            serviceBoxes: [],
            technologyImages: [],
            processSteps: [],
            sliderTextsObjects: [],
            aboutImages: [],
            founderSlides: [],
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
        setValue,
        formState: { errors },
    } = form;

    // Field Arrays
    const {
        fields: slideFields,
        append: appendSlide,
        remove: removeSlide,
    } = useFieldArray({ control, name: "slides" });
    const {
        fields: trustFields,
        append: appendTrust,
        remove: removeTrust,
    } = useFieldArray({ control, name: "trustIcons" });
    const {
        fields: serviceFields,
        append: appendService,
        remove: removeService,
    } = useFieldArray({ control, name: "serviceBoxes" });
    const {
        fields: techFields,
        append: appendTech,
        remove: removeTech,
    } = useFieldArray({ control, name: "technologyImages" });
    const {
        fields: processFields,
        append: appendProcess,
        remove: removeProcess,
    } = useFieldArray({ control, name: "processSteps" });
    const {
        fields: sliderTextFields,
        append: appendSliderText,
        remove: removeSliderText,
    } = useFieldArray({ control, name: "sliderTextsObjects" });
    const {
        fields: aboutImageFields,
        append: appendAboutImage,
        remove: removeAboutImage,
    } = useFieldArray({ control, name: "aboutImages" });
    const {
        fields: founderFields,
        append: appendFounder,
        remove: removeFounder,
    } = useFieldArray({ control, name: "founderSlides" });

    const watchSeoTitle = watch("seoTitle");
    const watchSeoDescription = watch("seoDescription");

    // Load Homepage Data
    const loadHomepage = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getHomepage();
            if (response.data) {
                // Transform sliderTexts array of strings to array of objects for RHF
                const sliderTextsObjects = (
                    response.data.sliderTexts || []
                ).map((text) => ({ text }));

                // Helper to transform 0-indexed order to 1-indexed for display
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const transformOrder = (arr: any[]) =>
                    (arr || []).map((item) => ({
                        ...item,
                        order:
                            typeof item.order === "number" ? item.order + 1 : 1,
                    }));

                reset({
                    ...response.data,
                    slides: transformOrder(response.data.slides),
                    trustIcons: transformOrder(response.data.trustIcons),
                    serviceBoxes: transformOrder(response.data.serviceBoxes),
                    technologyImages: transformOrder(
                        response.data.technologyImages,
                    ),
                    processSteps: transformOrder(response.data.processSteps),
                    founderSlides: transformOrder(response.data.founderSlides),
                    sliderTextsObjects,
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message || "Failed to load Homepage";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        loadHomepage();
    }, [loadHomepage]);

    const onSubmit = useCallback(async (data: HomepageFormData) => {
        setIsSubmitting(true);
        setError(null);
        setSubmitSuccess(false);

        try {
            // Transform sliderTextsObjects back to string array
            const sliderTexts = data.sliderTextsObjects.map((obj) => obj.text);

            // Helper to transform 1-indexed order back to 0-indexed for DB
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformOrderBack = (arr: any[]) =>
                (arr || []).map((item) => ({
                    ...item,
                    order: Math.max(
                        0,
                        typeof item.order === "number" ? item.order - 1 : 0,
                    ),
                }));

            // Exclude the temporary field using destructuring with unused var renaming
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { sliderTextsObjects: _temp, ...rest } = data;

            const submitData = {
                ...rest,
                sliderTexts,
                slides: transformOrderBack(data.slides),
                trustIcons: transformOrderBack(data.trustIcons),
                serviceBoxes: transformOrderBack(data.serviceBoxes),
                technologyImages: transformOrderBack(data.technologyImages),
                processSteps: transformOrderBack(data.processSteps),
                founderSlides: transformOrderBack(data.founderSlides),
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await updateHomepage(submitData as any);
            setSubmitSuccess(true);
            // Optional: scroll to top or show toast
            window.scrollTo({ top: 0, behavior: "smooth" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message || "Failed to save Homepage";
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

    const handlePreview = useCallback(() => {
        setIsPreviewOpen(true);
    }, []);

    const tabs: FormTab[] = [
        {
            id: "hero",
            label: "Hero Slider",
            icon: "🖼️",
            count: slideFields.length,
        },
        {
            id: "trust",
            label: "Trust Icons",
            icon: "🤝",
            count: trustFields.length,
        },
        {
            id: "services",
            label: "Services",
            icon: "🛠️",
            count: serviceFields.length,
        },
        {
            id: "technology",
            label: "Technology",
            icon: "💻",
            count: techFields.length,
        },
        {
            id: "process",
            label: "Process",
            icon: "🔄",
            count: processFields.length,
        },
        {
            id: "marquee",
            label: "Marquee",
            icon: "📢",
            count: sliderTextFields.length,
        },
        { id: "about", label: "About", icon: "ℹ️" },
        {
            id: "founder",
            label: "Founders",
            icon: "👥",
            count: founderFields.length,
        },
        { id: "contact", label: "Contact", icon: "📞" },
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
                            Homepage updated successfully!
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
                title="Edit Homepage"
                subtitle="Manage your homepage content, slides, and sections"
                isEditMode={true}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form={form as any}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                contentType={"homepage" as any}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enableKeyboardShortcuts={true}
            >
                {/* Hero Tab */}
                {activeTab === "hero" && (
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <FormField
                                id="sliderTitle"
                                label="Slider Title"
                                className="flex-grow mr-4"
                            >
                                <input
                                    id="sliderTitle"
                                    type="text"
                                    {...register("sliderTitle")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </FormField>
                            {/* Preview Button */}
                            <button
                                type="button"
                                onClick={handlePreview}
                                className="px-4 py-2 h-10 mt-6 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
                            >
                                Preview Homepage
                            </button>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Slides
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    appendSlide({
                                        image: { url: "" },
                                        order: slideFields.length + 1,
                                    })
                                }
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Slide
                            </button>
                        </div>

                        <div className="space-y-4">
                            {slideFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeSlide(index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Image
                                            </Label>
                                            <FormImagePreview
                                                url={watch(
                                                    `slides.${index}.image.url`,
                                                )}
                                                onUpload={(url) =>
                                                    setValue(
                                                        `slides.${index}.image.url`,
                                                        url,
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                onRemove={() =>
                                                    setValue(
                                                        `slides.${index}.image.url`,
                                                        "",
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                folder="homepage-slides"
                                            />
                                        </div>
                                        <FormField
                                            id={`slides.${index}.order`}
                                            label="Order"
                                        >
                                            <input
                                                type="number"
                                                {...register(
                                                    `slides.${index}.order` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trust Icons Tab */}
                {activeTab === "trust" && (
                    <div className="space-y-6">
                        <FormField id="trustIconsHeading" label="Heading">
                            <input
                                type="text"
                                {...register("trustIconsHeading")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </FormField>

                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Trust Icons
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    appendTrust({
                                        image: { url: "" },
                                        number: "",
                                        name: "",
                                        order: trustFields.length + 1,
                                    })
                                }
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Icon
                            </button>
                        </div>

                        <div className="space-y-4">
                            {trustFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeTrust(index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            id={`trustIcons.${index}.name`}
                                            label="Name"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `trustIcons.${index}.name` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <FormField
                                            id={`trustIcons.${index}.number`}
                                            label="Number"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `trustIcons.${index}.number` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <div className="md:col-span-2">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Icon Image
                                            </Label>
                                            <FormImagePreview
                                                url={watch(
                                                    `trustIcons.${index}.image.url`,
                                                )}
                                                onUpload={(url) =>
                                                    setValue(
                                                        `trustIcons.${index}.image.url`,
                                                        url,
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                onRemove={() =>
                                                    setValue(
                                                        `trustIcons.${index}.image.url`,
                                                        "",
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                folder="trust-icons"
                                            />
                                        </div>
                                        <FormField
                                            id={`trustIcons.${index}.order`}
                                            label="Order"
                                        >
                                            <input
                                                type="number"
                                                {...register(
                                                    `trustIcons.${index}.order` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === "services" && (
                    <div className="space-y-6">
                        <FormField id="serviceHeading" label="Service Heading">
                            <input
                                type="text"
                                {...register("serviceHeading")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </FormField>
                        <FormField id="serviceCta" label="Service CTA Text">
                            <input
                                type="text"
                                {...register("serviceCta")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </FormField>

                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Service Boxes
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    appendService({
                                        title: "",
                                        url: "",
                                        image: { url: "" },
                                        order: serviceFields.length + 1,
                                    })
                                }
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Service
                            </button>
                        </div>

                        <div className="space-y-4">
                            {serviceFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeService(index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            id={`serviceBoxes.${index}.title`}
                                            label="Title"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `serviceBoxes.${index}.title` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <FormField
                                            id={`serviceBoxes.${index}.url`}
                                            label="Link URL"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `serviceBoxes.${index}.url` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <div className="md:col-span-2">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Service Image
                                            </Label>
                                            <FormImagePreview
                                                url={watch(
                                                    `serviceBoxes.${index}.image.url`,
                                                )}
                                                onUpload={(url) =>
                                                    setValue(
                                                        `serviceBoxes.${index}.image.url`,
                                                        url,
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                onRemove={() =>
                                                    setValue(
                                                        `serviceBoxes.${index}.image.url`,
                                                        "",
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                folder="service-boxes"
                                            />
                                        </div>
                                        <FormField
                                            id={`serviceBoxes.${index}.order`}
                                            label="Order"
                                        >
                                            <input
                                                type="number"
                                                {...register(
                                                    `serviceBoxes.${index}.order` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Technology Icons Tab */}
                {activeTab === "technology" && (
                    <div className="space-y-6">
                        <FormField id="technologyHeading" label="Heading">
                            <input
                                type="text"
                                {...register("technologyHeading")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </FormField>

                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Images
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    appendTech({
                                        image: { url: "" },
                                        order: techFields.length + 1,
                                    })
                                }
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Image
                            </button>
                        </div>
                        <div className="space-y-4">
                            {techFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative flex items-end gap-4"
                                >
                                    <div className="flex-grow">
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL
                                        </Label>
                                        <FormImagePreview
                                            url={watch(
                                                `technologyImages.${index}.image.url`,
                                            )}
                                            onUpload={(url) =>
                                                setValue(
                                                    `technologyImages.${index}.image.url`,
                                                    url,
                                                    { shouldDirty: true },
                                                )
                                            }
                                            onRemove={() =>
                                                setValue(
                                                    `technologyImages.${index}.image.url`,
                                                    "",
                                                    { shouldDirty: true },
                                                )
                                            }
                                            folder="technology-icons"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <FormField
                                            id={`technologyImages.${index}.order`}
                                            label="Order"
                                        >
                                            <input
                                                type="number"
                                                {...register(
                                                    `technologyImages.${index}.order` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeTech(index)}
                                        className="text-red-600 hover:text-red-800 text-sm mb-4"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Process Tab */}
                {activeTab === "process" && (
                    <div className="space-y-6">
                        <FormField id="workingProcessHeading" label="Heading">
                            <input
                                type="text"
                                {...register("workingProcessHeading")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </FormField>
                        <FormField
                            id="workingProcessSubHeading"
                            label="Sub-Heading"
                        >
                            <textarea
                                {...register("workingProcessSubHeading")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                                rows={2}
                            />
                        </FormField>

                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Process Steps
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    appendProcess({
                                        title: "",
                                        description: "",
                                        image: { url: "" },
                                        order: processFields.length + 1,
                                    })
                                }
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Step
                            </button>
                        </div>
                        <div className="space-y-4">
                            {processFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeProcess(index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            id={`processSteps.${index}.title`}
                                            label="Title"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `processSteps.${index}.title` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <FormField
                                            id={`processSteps.${index}.order`}
                                            label="Order"
                                        >
                                            <input
                                                type="number"
                                                {...register(
                                                    `processSteps.${index}.order` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <div className="md:col-span-2">
                                            <FormField
                                                id={`processSteps.${index}.description`}
                                                label="Description"
                                            >
                                                <textarea
                                                    {...register(
                                                        `processSteps.${index}.description` as const,
                                                    )}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    rows={3}
                                                />
                                            </FormField>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Step Image
                                            </Label>
                                            <FormImagePreview
                                                url={watch(
                                                    `processSteps.${index}.image.url`,
                                                )}
                                                onUpload={(url) =>
                                                    setValue(
                                                        `processSteps.${index}.image.url`,
                                                        url,
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                onRemove={() =>
                                                    setValue(
                                                        `processSteps.${index}.image.url`,
                                                        "",
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                folder="process-steps"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Marquee Tab */}
                {activeTab === "marquee" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Slider Texts
                            </h3>
                            <button
                                type="button"
                                onClick={() => appendSliderText({ text: "" })}
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Text
                            </button>
                        </div>
                        <div className="space-y-2">
                            {sliderTextFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register(
                                            `sliderTextsObjects.${index}.text` as const,
                                        )}
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Enter text item"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSliderText(index)}
                                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === "about" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                id="aboutLightHeading"
                                label="Light Heading"
                            >
                                <input
                                    type="text"
                                    {...register("aboutLightHeading")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </FormField>
                            <FormField id="aboutUsHeading" label="Main Heading">
                                <input
                                    type="text"
                                    {...register("aboutUsHeading")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </FormField>
                            <FormField
                                id="aboutRightHeading"
                                label="Right Heading"
                            >
                                <input
                                    type="text"
                                    {...register("aboutRightHeading")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </FormField>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                About Paragraph
                            </label>
                            <Controller
                                name="aboutParagraph"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ReactQuill
                                        theme="snow"
                                        value={value || ""}
                                        onChange={onChange}
                                        modules={quillModules}
                                        className="bg-white"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                id="aboutCtaButton"
                                label="CTA Button Text"
                            >
                                <input
                                    type="text"
                                    {...register("aboutCtaButton")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </FormField>
                            <FormField id="aboutVideo.url" label="Video URL">
                                <input
                                    type="text"
                                    {...register("aboutVideo.url")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </FormField>
                            <FormField id="peopleText" label="People Text">
                                <input
                                    type="text"
                                    {...register("peopleText")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </FormField>
                        </div>

                        {/* About Images */}
                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                About Images
                            </h3>
                            <button
                                type="button"
                                onClick={() => appendAboutImage({ url: "" })}
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Image
                            </button>
                        </div>
                        <div className="space-y-2">
                            {aboutImageFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeAboutImage(index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                    <div className="md:col-span-2">
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                                            About Image {index + 1}
                                        </Label>
                                        <FormImagePreview
                                            url={watch(
                                                `aboutImages.${index}.url`,
                                            )}
                                            onUpload={(url) =>
                                                setValue(
                                                    `aboutImages.${index}.url`,
                                                    url,
                                                    { shouldDirty: true },
                                                )
                                            }
                                            onRemove={() =>
                                                setValue(
                                                    `aboutImages.${index}.url`,
                                                    "",
                                                    { shouldDirty: true },
                                                )
                                            }
                                            folder="about-images"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Focus Founders (embedded in About usually, but separated for clarity in Tabs) */}
                {activeTab === "founder" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                Founder Slides
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    appendFounder({
                                        title: "",
                                        description: "",
                                        name: "",
                                        image: { url: "" },
                                        order: founderFields.length + 1,
                                    })
                                }
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                + Add Founder
                            </button>
                        </div>
                        <div className="space-y-6">
                            {founderFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeFounder(index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField
                                            id={`founderSlides.${index}.name`}
                                            label="Name"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `founderSlides.${index}.name` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <FormField
                                            id={`founderSlides.${index}.title`}
                                            label="Title (Role)"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `founderSlides.${index}.title` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <FormField
                                            id={`founderSlides.${index}.achievements`}
                                            label="Achievements"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `founderSlides.${index}.achievements` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <div className="md:col-span-2">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Founder Image
                                            </Label>
                                            <FormImagePreview
                                                url={watch(
                                                    `founderSlides.${index}.image.url`,
                                                )}
                                                onUpload={(url) =>
                                                    setValue(
                                                        `founderSlides.${index}.image.url`,
                                                        url,
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                onRemove={() =>
                                                    setValue(
                                                        `founderSlides.${index}.image.url`,
                                                        "",
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                folder="founders"
                                            />
                                        </div>
                                        <FormField
                                            id={`founderSlides.${index}.partner`}
                                            label="Partner"
                                        >
                                            <input
                                                type="text"
                                                {...register(
                                                    `founderSlides.${index}.partner` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                        <FormField
                                            id={`founderSlides.${index}.order`}
                                            label="Order"
                                        >
                                            <input
                                                type="number"
                                                {...register(
                                                    `founderSlides.${index}.order` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <Controller
                                                name={`founderSlides.${index}.description`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                }) => (
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={value || ""}
                                                        onChange={onChange}
                                                        modules={quillModules}
                                                        className="bg-white"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description Two (Optional)
                                            </label>
                                            <Controller
                                                name={`founderSlides.${index}.descriptionTwo`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                }) => (
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={value || ""}
                                                        onChange={onChange}
                                                        modules={quillModules}
                                                        className="bg-white"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                    <div className="space-y-6">
                        <FormField id="contactTitle" label="Contact Title">
                            <input
                                type="text"
                                {...register("contactTitle")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </FormField>
                        <FormField
                            id="contactButton"
                            label="Contact Button Label"
                        >
                            <input
                                type="text"
                                {...register("contactButton")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </FormField>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Image
                            </Label>
                            <FormImagePreview
                                url={watch("contactImage.url")}
                                onUpload={(url) =>
                                    setValue("contactImage.url", url, {
                                        shouldDirty: true,
                                    })
                                }
                                onRemove={() =>
                                    setValue("contactImage.url", "", {
                                        shouldDirty: true,
                                    })
                                }
                                folder="contact"
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
                                        {watchSeoTitle || "Homepage Title"}
                                    </p>
                                    <p className="text-green-700 text-sm">
                                        https://yoursite.com/
                                    </p>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {watchSeoDescription ||
                                            "All the details about our business..."}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FormField
                                    id="seoTitle"
                                    label="SEO Title"
                                    error={errors.seoTitle?.message}
                                >
                                    <input
                                        id="seoTitle"
                                        type="text"
                                        {...register("seoTitle")}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.seoTitle
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                            }`}
                                    />
                                </FormField>
                                <FormField
                                    id="seoDescription"
                                    label="SEO Description"
                                    error={errors.seoDescription?.message}
                                >
                                    <textarea
                                        id="seoDescription"
                                        {...register("seoDescription")}
                                        rows={3}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.seoDescription
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                            }`}
                                        placeholder="SEO optimized description"
                                    />
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
                title="Homepage"
                contentType="homepage"
                data={getValues()}
            />
        </>
    );
}
