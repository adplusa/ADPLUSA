import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormWrapper, FormField } from "../components/FormWrapper";
import type { FormTab } from "../components/FormWrapper";
import { seoSchema } from "../utils/validation";
import { getContact, updateContact } from "../services/content.service";
import SocialLinksEditor from "../components/SocialLinksEditor";
import PreviewModal from "../components/PreviewModal";

// Validation schema
const contactSchema = z
    .object({
        _id: z.string().optional(),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        contactInfo: z
            .object({
                email: z.string().optional(),
                phone: z.string().optional(),
                address: z.string().optional(),
                destinationEmail: z
                    .string()
                    .email("Invalid email address")
                    .optional()
                    .or(z.literal("")),
            })
            .optional(),
        socialLinks: z
            .array(
                z.object({
                    platform: z.string(),
                    url: z.string(),
                    isActive: z.boolean(),
                }),
            )
            .optional(),
        customHeadTags: z.string().optional(),
    })
    .merge(seoSchema);

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("general");

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema) as any,
        defaultValues: {
            title: "",
            contactInfo: {
                email: "",
                phone: "",
                address: "",
                destinationEmail: "",
            },
            socialLinks: [],
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

    const watchSeoTitle = watch("seoTitle");
    const watchSeoDescription = watch("seoDescription");

    const loadContact = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getContact();
            if (response.data) {
                reset({
                    ...response.data,
                    contactInfo: {
                        ...(response.data as any).contactInfo,
                        destinationEmail:
                            (response.data as any).contactInfo
                                ?.destinationEmail || "",
                    },
                    metaTags: (response.data as any).metaTags || [],
                } as any);
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error?.message ||
                "Failed to load Contact page";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        loadContact();
    }, [loadContact]);

    const onSubmit = useCallback(
        async (data: ContactFormData) => {
            setIsSubmitting(true);
            setError(null);
            setSubmitSuccess(false);

            try {
                // Create a copy of data and remove _id to prevent Mongoose update errors
                const { _id, ...updateData } = data;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response = await updateContact(updateData as any);
                setSubmitSuccess(true);

                setTimeout(() => {
                    navigate("/dashboard/contact");
                }, 1500);
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.error?.message ||
                    "Failed to save Contact page";
                setError(errorMessage);
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [navigate],
    );

    const handleCancel = useCallback(() => {
        navigate("/dashboard/contact");
    }, [navigate]);

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    const handlePreview = useCallback(() => {
        setIsPreviewOpen(true);
    }, []);

    const tabs: FormTab[] = [
        { id: "general", label: "General Info", icon: "📝" },
        { id: "social", label: "Social Media", icon: "🌐" },
        { id: "destination", label: "Destination Email", icon: "📧" },
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
                            Contact page updated successfully!
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
                title="Edit Contact Page"
                subtitle="Manage contact information and social links"
                isEditMode={true}
                form={form as any}
                isSubmitting={isSubmitting}
                isLoading={loading}
                onSubmit={onSubmit}
                onCancel={handleCancel}
                enableDraftSave={true}
                contentType="contact"
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enableKeyboardShortcuts={true}
            >
                {/* General Tab */}
                {activeTab === "general" && (
                    <div className="space-y-6">
                        <FormField
                            id="title"
                            label="Page Title"
                            required
                            error={errors.title?.message}
                        >
                            <input
                                id="title"
                                type="text"
                                {...register("title")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Contact Us"
                            />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                id="contactInfo.email"
                                label="Email Address"
                            >
                                <input
                                    id="contactInfo.email"
                                    type="email"
                                    {...register("contactInfo.email")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="contact@example.com"
                                />
                            </FormField>

                            <FormField
                                id="contactInfo.phone"
                                label="Phone Number"
                            >
                                <input
                                    id="contactInfo.phone"
                                    type="text"
                                    {...register("contactInfo.phone")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </FormField>
                        </div>

                        <FormField id="contactInfo.address" label="Address">
                            <textarea
                                id="contactInfo.address"
                                {...register("contactInfo.address")}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="123 Main St, City, Country"
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
                                Preview Contact Page
                            </button>
                        </div>
                    </div>
                )}

                {/* Social Media Tab */}
                {activeTab === "social" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Social Media Links
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Add links to your social media profiles. These
                                will be displayed in the "Follow Us" section.
                            </p>

                            <Controller
                                name="socialLinks"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <SocialLinksEditor
                                        value={value || []}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Destination Email Tab */}
                {activeTab === "destination" && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">ℹ️</div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-800">
                                        Configure the email address where
                                        contact form submissions will be sent.
                                        <br />
                                        <span className="text-xs opacity-80 mt-1 block">
                                            If left empty, the system will try
                                            to use the{" "}
                                            <strong>Email Address</strong> from
                                            the General Info tab.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <FormField
                            id="contactInfo.destinationEmail"
                            label="Destination Email Address"
                            error={
                                errors.contactInfo?.destinationEmail?.message
                            }
                        >
                            <input
                                id="contactInfo.destinationEmail"
                                type="email"
                                {...register("contactInfo.destinationEmail")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="admin@example.com"
                            />
                        </FormField>
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
                                            "Contact Us"}
                                    </p>
                                    <p className="text-green-700 text-sm">
                                        https://yoursite.com/contact
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
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.seoTitle
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="SEO optimized title (50-60 characters)"
                                    />
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
                title="Contact Page"
                contentType="contact"
                data={getValues()}
            />
        </>
    );
}
