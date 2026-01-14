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
import { getHomepage } from "../services/homepage.service";
import type {
    Homepage as HomepageType,
    Slide,
    TrustIcon,
    ServiceBox,
    TechnologyImage,
    ProcessStep,
    FounderSlide,
} from "../services/homepage.service";
import {
    Edit,
    Home,
    Image as ImageIcon,
    Users,
    Briefcase,
    Cpu,
    Cog,
    MessageSquare,
    UserCircle,
    Phone,
    Layers,
    Play,
} from "lucide-react";

export default function Homepage() {
    const navigate = useNavigate();
    const [homepage, setHomepage] = useState<HomepageType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomepage = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getHomepage();
                setHomepage(response.data);
            } catch (err: unknown) {
                const apiError = err as {
                    response?: { data?: { error?: { message?: string } } };
                };
                setError(
                    apiError.response?.data?.error?.message ||
                        "Failed to load homepage"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHomepage();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Homepage
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your homepage content
                        </p>
                    </div>
                    <Button disabled className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Homepage
                    </Button>
                </div>
                <div className="grid gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-6 bg-muted rounded w-1/3"></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-3/4"></div>
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
                            Homepage
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your homepage content
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/dashboard/homepage/edit")}
                        className="gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Homepage
                    </Button>
                </div>
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!homepage) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Homepage
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your homepage content
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/dashboard/homepage/edit")}
                        className="gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Homepage
                    </Button>
                </div>
                <Card>
                    <CardContent className="py-12 text-center">
                        <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                            No homepage content found.
                        </p>
                        <Button
                            onClick={() => navigate("/dashboard/homepage/edit")}
                        >
                            Add Homepage Content
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 min-w-0 overflow-x-hidden">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Homepage
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your homepage content
                    </p>
                </div>
                <Button
                    onClick={() => navigate("/dashboard/homepage/edit")}
                    className="gap-2"
                >
                    <Edit className="h-4 w-4" />
                    Edit Homepage
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Hero Slider Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <ImageIcon className="h-5 w-5" />
                                <CardTitle>Hero Slider</CardTitle>
                            </div>
                            <Badge variant="secondary">
                                {homepage.slides?.length || 0} slides
                            </Badge>
                        </div>
                        <CardDescription>
                            Main hero slider images and title
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {homepage.sliderTitle && (
                            <div className="mb-4">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Slider Title
                                </label>
                                <p className="text-lg font-semibold">
                                    {homepage.sliderTitle}
                                </p>
                            </div>
                        )}
                        {homepage.slides && homepage.slides.length > 0 && (
                            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {homepage.slides
                                    .sort((a, b) => a.order - b.order)
                                    .map((slide: Slide, index: number) => (
                                        <div
                                            key={index}
                                            className="relative aspect-video rounded-lg overflow-hidden border bg-muted"
                                        >
                                            {slide.image?.url && (
                                                <img
                                                    src={slide.image.url}
                                                    alt={
                                                        slide.image.alt ||
                                                        `Slide ${index + 1}`
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                                                #{slide.order}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Trust Icons Section */}
                {homepage.trustIcons && homepage.trustIcons.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5" />
                                    <CardTitle>Trust Icons</CardTitle>
                                </div>
                                <Badge variant="secondary">
                                    {homepage.trustIcons.length} icons
                                </Badge>
                            </div>
                            {homepage.trustIconsHeading && (
                                <CardDescription>
                                    {homepage.trustIconsHeading}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {homepage.trustIcons
                                    .sort((a, b) => a.order - b.order)
                                    .map((icon: TrustIcon, index: number) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg border bg-muted/50 text-center"
                                        >
                                            {icon.image?.url && (
                                                <img
                                                    src={icon.image.url}
                                                    alt={icon.name}
                                                    className="w-12 h-12 mx-auto mb-2 object-contain"
                                                />
                                            )}
                                            <p className="text-2xl font-bold">
                                                {icon.number}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {icon.name}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Services Section */}
                {homepage.serviceBoxes && homepage.serviceBoxes.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Briefcase className="h-5 w-5" />
                                    <CardTitle>Services</CardTitle>
                                </div>
                                <Badge variant="secondary">
                                    {homepage.serviceBoxes.length} services
                                </Badge>
                            </div>
                            {homepage.serviceHeading && (
                                <CardDescription>
                                    {homepage.serviceHeading}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {homepage.serviceBoxes
                                    .sort((a, b) => a.order - b.order)
                                    .map(
                                        (
                                            service: ServiceBox,
                                            index: number
                                        ) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-lg border bg-card"
                                            >
                                                {service.image?.url && (
                                                    <div className="aspect-video rounded overflow-hidden mb-3 bg-muted">
                                                        <img
                                                            src={
                                                                service.image
                                                                    .url
                                                            }
                                                            alt={service.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <p className="font-medium truncate">
                                                    {service.title}
                                                </p>
                                                {service.url && (
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {service.url}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    )}
                            </div>
                            {homepage.serviceCta && (
                                <div className="mt-4 pt-4 border-t">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        CTA Button
                                    </label>
                                    <p className="text-sm">
                                        {homepage.serviceCta}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Technology Section */}
                {homepage.technologyImages &&
                    homepage.technologyImages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Cpu className="h-5 w-5" />
                                        <CardTitle>Technology</CardTitle>
                                    </div>
                                    <Badge variant="secondary">
                                        {homepage.technologyImages.length}{" "}
                                        images
                                    </Badge>
                                </div>
                                {homepage.technologyHeading && (
                                    <CardDescription>
                                        {homepage.technologyHeading}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {homepage.technologyImages
                                        .sort((a, b) => a.order - b.order)
                                        .map(
                                            (
                                                tech: TechnologyImage,
                                                index: number
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="p-3 rounded-lg border bg-white aspect-square flex items-center justify-center"
                                                >
                                                    {tech.image?.url && (
                                                        <img
                                                            src={tech.image.url}
                                                            alt={
                                                                tech.image
                                                                    .alt ||
                                                                `Technology ${
                                                                    index + 1
                                                                }`
                                                            }
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                            )
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {/* Working Process Section */}
                {homepage.processSteps && homepage.processSteps.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Cog className="h-5 w-5" />
                                    <CardTitle>Working Process</CardTitle>
                                </div>
                                <Badge variant="secondary">
                                    {homepage.processSteps.length} steps
                                </Badge>
                            </div>
                            {homepage.workingProcessHeading && (
                                <CardDescription>
                                    {homepage.workingProcessHeading}
                                </CardDescription>
                            )}
                            {homepage.workingProcessSubHeading && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {homepage.workingProcessSubHeading}
                                </p>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {homepage.processSteps
                                    .sort((a, b) => a.order - b.order)
                                    .map((step: ProcessStep, index: number) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg border bg-card"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="outline">
                                                    {step.order}
                                                </Badge>
                                                <h4 className="font-medium">
                                                    {step.title}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {step.description}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Marquee/Slider Texts */}
                {homepage.sliderTexts && homepage.sliderTexts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Layers className="h-5 w-5" />
                                    <CardTitle>Text Marquee</CardTitle>
                                </div>
                                <Badge variant="secondary">
                                    {homepage.sliderTexts.length} texts
                                </Badge>
                            </div>
                            <CardDescription>
                                Scrolling text content
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {homepage.sliderTexts.map(
                                    (text: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="text-sm"
                                        >
                                            {text}
                                        </Badge>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* About Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <CardTitle>About Section</CardTitle>
                        </div>
                        <CardDescription>
                            About content displayed on homepage
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Light Heading
                                </label>
                                <p className="text-sm">
                                    {homepage.aboutLightHeading || (
                                        <span className="italic text-muted-foreground">
                                            Not set
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Us Heading
                                </label>
                                <p className="text-sm">
                                    {homepage.aboutUsHeading || (
                                        <span className="italic text-muted-foreground">
                                            Not set
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Right Heading
                                </label>
                                <p className="text-sm">
                                    {homepage.aboutRightHeading || (
                                        <span className="italic text-muted-foreground">
                                            Not set
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        {homepage.aboutParagraph && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Paragraph
                                </label>
                                <div
                                    className="mt-1 p-3 rounded bg-muted text-sm prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: homepage.aboutParagraph,
                                    }}
                                />
                            </div>
                        )}
                        {homepage.aboutCtaButton && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    CTA Button
                                </label>
                                <p className="text-sm">
                                    {homepage.aboutCtaButton}
                                </p>
                            </div>
                        )}
                        {homepage.aboutVideo?.url && (
                            <div className="flex items-center gap-2 p-3 rounded bg-muted">
                                <Play className="h-4 w-4" />
                                <span className="text-sm">
                                    Video URL: {homepage.aboutVideo.url}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Founder Slides */}
                {homepage.founderSlides &&
                    homepage.founderSlides.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <UserCircle className="h-5 w-5" />
                                        <CardTitle>Founder Slides</CardTitle>
                                    </div>
                                    <Badge variant="secondary">
                                        {homepage.founderSlides.length} slides
                                    </Badge>
                                </div>
                                {homepage.peopleText && (
                                    <CardDescription>
                                        {homepage.peopleText}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {homepage.founderSlides
                                        .sort((a, b) => a.order - b.order)
                                        .map(
                                            (
                                                founder: FounderSlide,
                                                index: number
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="p-4 rounded-lg border bg-card flex gap-4"
                                                >
                                                    {founder.image?.url && (
                                                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                                                            <img
                                                                src={
                                                                    founder
                                                                        .image
                                                                        .url
                                                                }
                                                                alt={
                                                                    founder.name
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <h4 className="font-medium">
                                                            {founder.name}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {founder.title}
                                                        </p>
                                                        {founder.achievements && (
                                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                {
                                                                    founder.achievements
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {/* Contact Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5" />
                            <CardTitle>Contact Section</CardTitle>
                        </div>
                        <CardDescription>
                            Contact CTA displayed on homepage
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Contact Title
                                </label>
                                <p className="text-sm">
                                    {homepage.contactTitle || (
                                        <span className="italic text-muted-foreground">
                                            Not set
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Contact Button
                                </label>
                                <p className="text-sm">
                                    {homepage.contactButton || (
                                        <span className="italic text-muted-foreground">
                                            Not set
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        {homepage.contactImage?.url && (
                            <div className="aspect-video max-w-md rounded overflow-hidden bg-muted">
                                <img
                                    src={homepage.contactImage.url}
                                    alt={homepage.contactImage.alt || "Contact"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SEO Information */}
                {(homepage.seoTitle || homepage.seoDescription) && (
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
                            {homepage.seoTitle && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        SEO Title
                                    </label>
                                    <p className="text-sm bg-muted p-2 rounded break-words">
                                        {homepage.seoTitle}
                                    </p>
                                </div>
                            )}
                            {homepage.seoDescription && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        SEO Description
                                    </label>
                                    <p className="text-sm bg-muted p-2 rounded break-words">
                                        {homepage.seoDescription}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Last Updated */}
            <div className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date(homepage.updatedAt).toLocaleDateString("en-US", {
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
