import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { getAbout } from "../services/content.service";
import type {
    About as AboutType,
    AboutSection,
    AnchorLink,
} from "../services/content.service";
import {
    Edit,
    Link as LinkIcon,
    FileText,
    Image as ImageIcon,
    Heading,
    AlignLeft,
    ExternalLink,
} from "lucide-react";

export default function About() {
    const navigate = useNavigate();
    const [about, setAbout] = useState<AboutType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAbout();
                setAbout(response);
            } catch (err: unknown) {
                const apiError = err as {
                    response?: { data?: { error?: { message?: string } } };
                };
                setError(
                    apiError.response?.data?.error?.message ||
                    "Failed to load about page"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAbout();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            About Page
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your about page content
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/dashboard/about/edit")}
                        className="gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit About Page
                    </Button>
                </div>

                <div className="grid gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-6 bg-muted rounded w-1/3"></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            About Page
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your about page content
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/dashboard/about/edit")}
                        className="gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit About Page
                    </Button>
                </div>
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!about) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            About Page
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your about page content
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/dashboard/about/edit")}
                        className="gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit About Page
                    </Button>
                </div>
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                            No about page content found.
                        </p>
                        <Button
                            onClick={() => navigate("/dashboard/about/edit")}
                        >
                            Add About Content
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const hasHeadings =
        about.allowLightHeading ||
        about.allowUsHeading ||
        about.allowRightHeading;
    const hasContent =
        hasHeadings ||
        about.paragraph ||
        about.anchorLinks?.length > 0 ||
        about.sections?.length > 0;

    return (
        <div className="space-y-8 min-w-0 overflow-x-hidden">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        About Page
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your about page content
                    </p>
                </div>
                <Button
                    onClick={() => navigate("/dashboard/about/edit")}
                    className="gap-2"
                >
                    <Edit className="h-4 w-4" />
                    Edit About Page
                </Button>
            </div>

            {!hasContent ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                            About page exists but has no content yet.
                        </p>
                        <Button
                            onClick={() => navigate("/dashboard/about/edit")}
                        >
                            Add Content
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {/* Hero Headings Card */}
                    {hasHeadings && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Heading className="h-5 w-5" />
                                    <CardTitle>Hero Headings</CardTitle>
                                </div>
                                <CardDescription>
                                    The main headings displayed at the top of
                                    the About page
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-3 min-w-0">
                                    <div className="space-y-2 min-w-0">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Allow Light Heading
                                        </label>
                                        <p className="text-lg font-semibold">
                                            {about.allowLightHeading || (
                                                <span className="text-muted-foreground italic">
                                                    Not set
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="space-y-2 min-w-0">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Allow Us Heading
                                        </label>
                                        <p className="text-lg font-semibold break-words">
                                            {about.allowUsHeading || (
                                                <span className="text-muted-foreground italic">
                                                    Not set
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="space-y-2 min-w-0">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Allow Right Heading
                                        </label>
                                        <p className="text-lg font-semibold break-words">
                                            {about.allowRightHeading || (
                                                <span className="text-muted-foreground italic">
                                                    Not set
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Paragraph */}
                    {about.paragraph && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <AlignLeft className="h-5 w-5" />
                                    <CardTitle>
                                        Introduction Paragraph
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    The main introductory text for the About
                                    page
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="prose prose-lg max-w-none break-words"
                                    dangerouslySetInnerHTML={{
                                        __html: about.paragraph,
                                    }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Anchor Links */}
                    {about.anchorLinks && about.anchorLinks.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <LinkIcon className="h-5 w-5" />
                                        <CardTitle>Anchor Links</CardTitle>
                                    </div>
                                    <Badge variant="secondary">
                                        {about.anchorLinks.length} links
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Navigation links that scroll to specific
                                    sections
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-w-0">
                                    {about.anchorLinks.map(
                                        (link: AnchorLink, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50 min-w-0"
                                            >
                                                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">
                                                        {link.label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        #{link.targetId}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Sections */}
                    {about.sections && about.sections.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5" />
                                        <CardTitle>Content Sections</CardTitle>
                                    </div>
                                    <Badge variant="secondary">
                                        {about.sections.length} sections
                                    </Badge>
                                </div>
                                <CardDescription>
                                    The main content sections of the About page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {about.sections.map(
                                    (section: AboutSection, index: number) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg border bg-card"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            Section {index + 1}
                                                        </Badge>
                                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                                            #{section.sectionId}
                                                        </code>
                                                    </div>
                                                    <h4 className="text-lg font-semibold">
                                                        {section.title}
                                                    </h4>
                                                </div>
                                                {typeof section.image === 'object' && section.image?.url && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <ImageIcon className="h-3 w-3" />
                                                        Has image
                                                    </div>
                                                )}
                                            </div>

                                            <div
                                                className="prose prose-sm max-w-none text-muted-foreground break-words"
                                                dangerouslySetInnerHTML={{
                                                    __html: section.body || "",
                                                }}
                                            />

                                            {typeof section.image === 'object' && section.image?.url && (
                                                <div className="mt-4 grid gap-2 sm:grid-cols-1">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-muted-foreground">
                                                            Image
                                                        </label>
                                                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                                            <img
                                                                src={
                                                                    section
                                                                        .image
                                                                        ?.url
                                                                }
                                                                alt={`${section.title} image`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* SEO Information */}
                    {(about.seoTitle || about.seoDescription) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    SEO Information
                                </CardTitle>
                                <CardDescription>
                                    Search engine optimization settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {about.seoTitle && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            SEO Title
                                        </label>
                                        <p className="text-sm bg-muted p-2 rounded break-words">
                                            {about.seoTitle}
                                        </p>
                                    </div>
                                )}
                                {about.seoDescription && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            SEO Description
                                        </label>
                                        <p className="text-sm bg-muted p-2 rounded break-words">
                                            {about.seoDescription}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Last Updated */}
            <div className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date(about.updatedAt || "").toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </div>
        </div>
    );
}
