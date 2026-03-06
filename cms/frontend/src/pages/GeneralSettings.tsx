import { useEffect, useState, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Settings as SettingsIcon,
    Image as ImageIcon,
    Save,
    Upload,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Trash2,
} from "lucide-react";
import {
    getGeneralSettings,
    updateGeneralSettings,
    type SettingsImage,
} from "../services/generalSettings.service";
import ImageUploader, { type UploadedImage } from "../components/ImageUploader";

interface ApiError {
    response?: {
        data?: {
            error?: {
                message?: string;
            };
        };
    };
}

export default function GeneralSettingsForm() {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [headerLogo, setHeaderLogo] = useState<SettingsImage | null>(null);
    const [footerLogo, setFooterLogo] = useState<SettingsImage | null>(null);
    const [favicon, setFavicon] = useState<SettingsImage | null>(null);
    const [siteName, setSiteName] = useState("");
    const [siteDescription, setSiteDescription] = useState("");
    const [customHeadTags, setCustomHeadTags] = useState("");

    // Image uploader visibility states
    const [showHeaderUploader, setShowHeaderUploader] = useState(false);
    const [showFooterUploader, setShowFooterUploader] = useState(false);
    const [showFaviconUploader, setShowFaviconUploader] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getGeneralSettings();
            if (response) {
                setHeaderLogo(response.headerLogo || null);
                setFooterLogo(response.footerLogo || null);
                setFavicon(response.favicon || null);
                setSiteName(response.siteName || "");
                setSiteDescription(response.siteDescription || "");
                setCustomHeadTags(response.customHeadTags || "");
            }
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const errorMessage =
                apiError.response?.data?.error?.message ||
                "Failed to load settings";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            console.log("Submitting settings:", {
                headerLogo,
                footerLogo,
                favicon,
                siteName,
                siteDescription,
            });
            await updateGeneralSettings({
                headerLogo: headerLogo, // Pass null explicitly if it is null
                footerLogo: footerLogo,
                favicon: favicon || undefined,
                siteName,
                siteDescription,
                customHeadTags,
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const errorMessage =
                apiError.response?.data?.error?.message ||
                "Failed to save settings";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleHeaderLogoChange = useCallback((images: UploadedImage[]) => {
        if (images.length > 0) {
            const img = images[0];
            setHeaderLogo({
                url: img.cdnUrl || img.cloudFrontUrl || img.url,
                alt: headerLogo?.alt || "Header Logo",
            });
        } else {
            setHeaderLogo(null);
        }
    }, [headerLogo]);

    const handleFooterLogoChange = useCallback((images: UploadedImage[]) => {
        if (images.length > 0) {
            const img = images[0];
            setFooterLogo({
                url: img.cdnUrl || img.cloudFrontUrl || img.url,
                alt: footerLogo?.alt || "Footer Logo",
            });
        } else {
            setFooterLogo(null);
        }
    }, [footerLogo]);

    const handleFaviconChange = useCallback((images: UploadedImage[]) => {
        if (images.length > 0) {
            const img = images[0];
            setFavicon({
                url: img.cdnUrl || img.cloudFrontUrl || img.url,
                alt: favicon?.alt || "Favicon",
            });
        } else {
            setFavicon(null);
        }
    }, [favicon]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    General Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your site&apos;s logos and branding assets.
                </p>
            </div>

            {/* Information Banner */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-800">
                            Updates reflect site-wide
                        </h3>
                        <p className="mt-1 text-sm text-blue-700">
                            Saving these settings will immediately update the
                            header, footer, and basic branding across your
                            entire website.
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-sm font-medium text-green-800">
                            Settings saved successfully!
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm font-medium text-red-800">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    {/* Header Logo */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <ImageIcon className="h-5 w-5" />
                                <CardTitle>Header Logo</CardTitle>
                            </div>
                            <CardDescription>
                                The logo displayed in the site header/navigation (recommended: PNG, SVG, or WEBP; 200-500px width)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {headerLogo?.url ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-48 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                                            <img
                                                src={headerLogo.url}
                                                alt="Header Logo Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowHeaderUploader(
                                                        !showHeaderUploader
                                                    )
                                                }
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Change Header Logo
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    setHeaderLogo(null)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="headerLogoAlt">
                                            Alt Text
                                        </Label>
                                        <Input
                                            id="headerLogoAlt"
                                            value={headerLogo.alt || ""}
                                            onChange={(e) =>
                                                setHeaderLogo({
                                                    ...headerLogo,
                                                    alt: e.target.value,
                                                })
                                            }
                                            placeholder="Header Logo"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowHeaderUploader(
                                            !showHeaderUploader
                                        )
                                    }
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Header Logo
                                </Button>
                            )}

                            {showHeaderUploader && (
                                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                    <ImageUploader
                                        multiple={false}
                                        maxFiles={1}
                                        maxSizeInMB={5}
                                        folder="logos"
                                        acceptedTypes={[
                                            "image/jpeg",
                                            "image/png",
                                            "image/gif",
                                            "image/webp",
                                            "image/svg+xml",
                                        ]}
                                        initialImages={headerLogo ? [{
                                            url: headerLogo.url,
                                            status: "success"
                                        }] : []}
                                        onImagesChange={handleHeaderLogoChange}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Footer Logo */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <ImageIcon className="h-5 w-5" />
                                <CardTitle>Footer Logo</CardTitle>
                            </div>
                            <CardDescription>
                                The logo displayed in the site footer (recommended: PNG, SVG, or WEBP)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {footerLogo?.url ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-48 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                                            <img
                                                src={footerLogo.url}
                                                alt="Footer Logo Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowFooterUploader(
                                                        !showFooterUploader
                                                    )
                                                }
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Change Footer Logo
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    setFooterLogo(null)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="footerLogoAlt">
                                            Alt Text
                                        </Label>
                                        <Input
                                            id="footerLogoAlt"
                                            value={footerLogo.alt || ""}
                                            onChange={(e) =>
                                                setFooterLogo({
                                                    ...footerLogo,
                                                    alt: e.target.value,
                                                })
                                            }
                                            placeholder="Footer Logo"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowFooterUploader(
                                            !showFooterUploader
                                        )
                                    }
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Footer Logo
                                </Button>
                            )}

                            {showFooterUploader && (
                                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                    <ImageUploader
                                        multiple={false}
                                        maxFiles={1}
                                        maxSizeInMB={5}
                                        folder="logos"
                                        acceptedTypes={[
                                            "image/jpeg",
                                            "image/png",
                                            "image/gif",
                                            "image/webp",
                                            "image/svg+xml",
                                        ]}
                                        initialImages={footerLogo ? [{
                                            url: footerLogo.url,
                                            status: "success"
                                        }] : []}
                                        onImagesChange={handleFooterLogoChange}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Favicon */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <ImageIcon className="h-5 w-5" />
                                <CardTitle>Favicon</CardTitle>
                            </div>
                            <CardDescription>
                                The small icon displayed in browser tabs
                                (recommended: 32x32 or 64x64 PNG/ICO)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {favicon?.url ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border">
                                            <img
                                                src={favicon.url}
                                                alt="Favicon Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowFaviconUploader(
                                                        !showFaviconUploader
                                                    )
                                                }
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Change Favicon
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setFavicon(null)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="faviconAlt">
                                            Alt Text
                                        </Label>
                                        <Input
                                            id="faviconAlt"
                                            value={favicon.alt || ""}
                                            onChange={(e) =>
                                                setFavicon({
                                                    ...favicon,
                                                    alt: e.target.value,
                                                })
                                            }
                                            placeholder="Favicon"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowFaviconUploader(
                                            !showFaviconUploader
                                        )
                                    }
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Favicon
                                </Button>
                            )}

                            {showFaviconUploader && (
                                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                    <ImageUploader
                                        multiple={false}
                                        maxFiles={1}
                                        maxSizeInMB={1}
                                        folder="logos"
                                        acceptedTypes={[
                                            "image/png",
                                            "image/x-icon",
                                            "image/vnd.microsoft.icon",
                                            "image/ico",
                                            "image/jpeg",
                                        ]}
                                        initialImages={favicon ? [{
                                            url: favicon.url,
                                            status: "success"
                                        }] : []}
                                        onImagesChange={handleFaviconChange}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Site Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <SettingsIcon className="h-5 w-5" />
                                <CardTitle>Site Information</CardTitle>
                            </div>
                            <CardDescription>
                                Basic information about your website
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    value={siteName}
                                    onChange={(e) =>
                                        setSiteName(e.target.value)
                                    }
                                    placeholder="ADPL Consulting LLC"
                                    maxLength={200}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">
                                    Site Description
                                </Label>
                                <Input
                                    id="siteDescription"
                                    value={siteDescription}
                                    onChange={(e) =>
                                        setSiteDescription(e.target.value)
                                    }
                                    placeholder="Brief description of your site"
                                    maxLength={500}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Global SEO / Head Tags */}
                    {/* <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <SettingsIcon className="h-5 w-5" />
                                <CardTitle>
                                    Global SEO / Custom Head Tags
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Add custom scripts, styles, or meta tags to be
                                injected into the &lt;head&gt; of EVERY page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customHeadTags">
                                    Custom Head Tags
                                </Label>
                                <textarea
                                    id="customHeadTags"
                                    value={customHeadTags}
                                    onChange={(e) =>
                                        setCustomHeadTags(e.target.value)
                                    }
                                    placeholder="<meta ... /> or <script>...</script>"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={5}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Warning: Scripts added here will run on
                                    every page. Ensure valid HTML.
                                </p>
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Save Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Settings
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
