import { useEffect } from "react";

export interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    contentType:
        | "project"
        | "service"
        | "faq"
        | "about"
        | "contact"
        | "homepage";
    data: any;
}

export default function PreviewModal({
    isOpen,
    onClose,
    title,
    contentType,
    data,
}: PreviewModalProps) {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const renderProjectPreview = () => (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {data.title}
                </h1>
                {data.category && (
                    <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                        {data.category}
                    </span>
                )}
                {data.featured && (
                    <span className="inline-block ml-2 px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
                        Featured
                    </span>
                )}
            </div>

            {/* Description */}
            {data.description && (
                <div className="prose max-w-none">
                    <p className="text-lg text-gray-700">{data.description}</p>
                </div>
            )}

            {/* Images */}
            {data.images && data.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.images.map((image: any, index: number) => (
                        <div
                            key={index}
                            className="rounded-lg overflow-hidden shadow-md"
                        >
                            <img
                                src={image.url}
                                alt={image.alt || `Project image ${index + 1}`}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* External Link */}
            {data.link && (
                <div className="pt-4 border-t border-gray-200">
                    <a
                        href={data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        View External Link →
                    </a>
                </div>
            )}
        </div>
    );

    const renderServicePreview = () => (
        <div className="space-y-6">
            {/* Banner Image */}
            {data.bannerImage?.url && (
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                    <img
                        src={data.bannerImage.url}
                        alt={`${data.title} banner`}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">{data.title}</h1>

            {/* Description */}
            {data.description && (
                <div className="prose max-w-none">
                    <p className="text-lg text-gray-700">{data.description}</p>
                </div>
            )}

            {/* Content (Rich Text) */}
            {data.content && (
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                />
            )}

            {/* Service Image */}
            {data.image?.url && (
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                    <img
                        src={data.image.url}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Features */}
            {data.features && data.features.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.features.map((feature: any, index: number) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderFAQPreview = () => (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
                {data.title || "FAQ"}
            </h1>

            {data.categories && data.categories.length > 0 && (
                <div className="space-y-8">
                    {data.categories.map((category: any, catIndex: number) => (
                        <div
                            key={catIndex}
                            className="border-b border-gray-200 pb-6"
                        >
                            <div className="flex items-start space-x-4 mb-4">
                                {category.image?.url && (
                                    <img
                                        src={category.image.url}
                                        alt={category.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {category.title}
                                    </h2>
                                    {category.description && (
                                        <p className="text-gray-700 mt-1">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {category.faqs && category.faqs.length > 0 && (
                                <div className="space-y-4 ml-20">
                                    {category.faqs.map(
                                        (faq: any, faqIndex: number) => (
                                            <div
                                                key={faqIndex}
                                                className="bg-gray-50 p-4 rounded-lg"
                                            >
                                                <h3 className="font-semibold text-gray-900 mb-2">
                                                    {faq.question}
                                                </h3>
                                                <p className="text-gray-700">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderAboutPreview = () => (
        <div className="space-y-6">
            {/* Headings */}
            {(data.allowLightHeading ||
                data.allowUsHeading ||
                data.allowRightHeading) && (
                <div className="text-center space-y-2">
                    {data.allowLightHeading && (
                        <p className="text-lg text-gray-600">
                            {data.allowLightHeading}
                        </p>
                    )}
                    {data.allowUsHeading && (
                        <h1 className="text-4xl font-bold text-gray-900">
                            {data.allowUsHeading}
                        </h1>
                    )}
                    {data.allowRightHeading && (
                        <p className="text-lg text-gray-600">
                            {data.allowRightHeading}
                        </p>
                    )}
                </div>
            )}

            {/* Paragraph */}
            {data.paragraph && (
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.paragraph }}
                />
            )}

            {/* Anchor Links */}
            {data.anchorLinks && data.anchorLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 py-4">
                    {data.anchorLinks.map((link: any, index: number) => (
                        <a
                            key={index}
                            href={`#${link.targetId}`}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}

            {/* Sections */}
            {data.sections && data.sections.length > 0 && (
                <div className="space-y-8">
                    {data.sections.map((section: any, index: number) => (
                        <div
                            key={index}
                            id={section.sectionId}
                            className="border-t border-gray-200 pt-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {section.title}
                            </h2>
                            {section.image?.url && (
                                <img
                                    src={section.image.url}
                                    alt={section.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}
                            <div className="prose max-w-none">
                                {section.body}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderContactPreview = () => (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>

            {data.email && (
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <a
                        href={`mailto:${data.email}`}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        {data.email}
                    </a>
                </div>
            )}

            {data.phone && (
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">Phone:</span>
                    <a
                        href={`tel:${data.phone}`}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        {data.phone}
                    </a>
                </div>
            )}

            {data.address && (
                <div className="flex items-start space-x-2">
                    <span className="font-semibold text-gray-700">
                        Address:
                    </span>
                    <p className="text-gray-700">{data.address}</p>
                </div>
            )}

            {data.description && (
                <div className="prose max-w-none">
                    <p className="text-gray-700">{data.description}</p>
                </div>
            )}
        </div>
    );

    const renderHomepagePreview = () => (
        <div className="space-y-8">
            {/* Hero */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold mb-2">Hero Section</h2>
                <p>
                    <strong>Slider Title:</strong> {data.sliderTitle}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {data.slides?.map((slide: any, idx: number) => (
                        <div key={idx} className="border p-2 rounded">
                            {slide.image?.url && (
                                <img
                                    src={slide.image.url}
                                    alt="Slide"
                                    className="h-20 w-auto object-cover"
                                />
                            )}
                            <p className="text-xs">Order: {slide.order}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Icons */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold mb-2">Trust Icons</h2>
                <p className="mb-2">
                    <strong>Heading:</strong> {data.trustIconsHeading}
                </p>
                <div className="flex gap-2 flex-wrap">
                    {data.trustIcons?.map((icon: any, idx: number) => (
                        <div
                            key={idx}
                            className="border p-2 rounded flex items-center gap-2"
                        >
                            {icon.image?.url && (
                                <img
                                    src={icon.image.url}
                                    className="h-8 w-8 object-cover"
                                />
                            )}
                            <div>
                                <p className="text-sm font-bold">
                                    {icon.number}
                                </p>
                                <p className="text-xs">{icon.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold mb-2">Services</h2>
                <p className="mb-2">
                    <strong>Heading:</strong> {data.serviceHeading}
                </p>
                <p className="mb-2">
                    <strong>CTA:</strong> {data.serviceCta}
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {data.serviceBoxes?.map((box: any, idx: number) => (
                        <div key={idx} className="border p-2 rounded">
                            {box.image?.url && (
                                <img
                                    src={box.image.url}
                                    className="h-16 w-full object-cover mb-2"
                                />
                            )}
                            <p className="font-bold">{box.title}</p>
                            <p className="text-xs text-blue-500">{box.url}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Process */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold mb-2">Working Process</h2>
                <p>
                    <strong>Heading:</strong> {data.workingProcessHeading}
                </p>
                <p className="mb-2">
                    <strong>Sub:</strong> {data.workingProcessSubHeading}
                </p>
                <ul className="list-disc pl-5">
                    {data.processSteps?.map((step: any, idx: number) => (
                        <li key={idx}>
                            <strong>{step.title}</strong>:{" "}
                            {step.description?.substring(0, 50)}...
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const renderPreviewContent = () => {
        switch (contentType) {
            case "project":
                return renderProjectPreview();
            case "service":
                return renderServicePreview();
            case "faq":
                return renderFAQPreview();
            case "about":
                return renderAboutPreview();
            case "contact":
                return renderContactPreview();
            case "homepage":
                return renderHomepagePreview();
            default:
                return (
                    <div className="text-gray-500">
                        Preview not available for this content type
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Preview: {title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                This is how your content will appear on the
                                frontend
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close preview"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8 overflow-y-auto max-h-[calc(90vh-80px)]">
                        {renderPreviewContent()}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Note: Actual styling may vary on the frontend
                            </p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
