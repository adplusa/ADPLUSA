import { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/**
 * Interface for a single meta tag with name and content fields
 */
export interface MetaTag {
    name: string;
    content: string;
}

/**
 * Props for the MetaTagsInput component
 */
export interface MetaTagsInputProps {
    /** Current array of meta tags */
    value: MetaTag[];
    /** Callback when meta tags change */
    onChange: (tags: MetaTag[]) => void;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Maximum number of meta tags allowed */
    maxTags?: number;
    /** Help text to display below the component */
    helpText?: string;
}

/**
 * A reusable component for structured meta tag input.
 * Allows adding/removing meta tag entries with name and content fields.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export default function MetaTagsInput({
    value = [],
    onChange,
    disabled = false,
    maxTags = 20,
    helpText = "Add meta tags for SEO. Each tag requires a name (e.g., 'robots', 'author') and content value.",
}: MetaTagsInputProps) {
    /**
     * Add a new empty meta tag entry
     */
    const handleAddTag = useCallback(() => {
        if (value.length >= maxTags) return;
        onChange([...value, { name: "", content: "" }]);
    }, [value, onChange, maxTags]);

    /**
     * Remove a meta tag at the specified index
     */
    const handleRemoveTag = useCallback(
        (index: number) => {
            const newTags = value.filter((_, i) => i !== index);
            onChange(newTags);
        },
        [value, onChange]
    );

    /**
     * Update a meta tag field at the specified index
     */
    const handleUpdateTag = useCallback(
        (index: number, field: keyof MetaTag, fieldValue: string) => {
            const newTags = value.map((tag, i) =>
                i === index ? { ...tag, [field]: fieldValue } : tag
            );
            onChange(newTags);
        },
        [value, onChange]
    );

    return (
        <div className="space-y-4">
            {/* Header with Add button */}
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                    Meta Tags
                </Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={disabled || value.length >= maxTags}
                    className="flex items-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add Meta Tag
                </Button>
            </div>

            {/* Help text */}
            {helpText && (
                <p className="text-sm text-gray-500">{helpText}</p>
            )}

            {/* Meta tag entries */}
            {value.length === 0 ? (
                <div className="text-sm text-gray-400 italic py-4 text-center border border-dashed border-gray-200 rounded-lg">
                    No meta tags added. Click "Add Meta Tag" to add one.
                </div>
            ) : (
                <div className="space-y-3">
                    {value.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            {/* Name field */}
                            <div className="flex-1 min-w-0">
                                <Label
                                    htmlFor={`meta-tag-name-${index}`}
                                    className="text-xs text-gray-500 mb-1 block"
                                >
                                    Name
                                </Label>
                                <Input
                                    id={`meta-tag-name-${index}`}
                                    type="text"
                                    value={tag.name}
                                    onChange={(e) =>
                                        handleUpdateTag(index, "name", e.target.value)
                                    }
                                    placeholder="e.g., robots, author, keywords"
                                    disabled={disabled}
                                    className="h-9"
                                    maxLength={100}
                                />
                            </div>

                            {/* Content field */}
                            <div className="flex-[2] min-w-0">
                                <Label
                                    htmlFor={`meta-tag-content-${index}`}
                                    className="text-xs text-gray-500 mb-1 block"
                                >
                                    Content
                                </Label>
                                <Input
                                    id={`meta-tag-content-${index}`}
                                    type="text"
                                    value={tag.content}
                                    onChange={(e) =>
                                        handleUpdateTag(index, "content", e.target.value)
                                    }
                                    placeholder="Meta tag content value"
                                    disabled={disabled}
                                    className="h-9"
                                    maxLength={500}
                                />
                            </div>

                            {/* Remove button */}
                            <div className="pt-5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveTag(index)}
                                    disabled={disabled}
                                    className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    aria-label={`Remove meta tag ${index + 1}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Max tags warning */}
            {value.length >= maxTags && (
                <p className="text-sm text-amber-600">
                    Maximum of {maxTags} meta tags reached.
                </p>
            )}

            {/* Preview section */}
            {value.length > 0 && value.some((tag) => tag.name && tag.content) && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <Label className="text-xs text-gray-500 mb-2 block">
                        Preview (HTML output)
                    </Label>
                    <code className="block text-xs text-gray-600 font-mono whitespace-pre-wrap">
                        {value
                            .filter((tag) => tag.name && tag.content)
                            .map(
                                (tag) =>
                                    `<meta name="${tag.name}" content="${tag.content}" />`
                            )
                            .join("\n")}
                    </code>
                </div>
            )}
        </div>
    );
}

/**
 * Helper function to convert legacy customHeadTags string to MetaTag array
 * This parses HTML meta tags from a string format
 */
export function parseCustomHeadTags(customHeadTags: string): MetaTag[] {
    if (!customHeadTags || typeof customHeadTags !== "string") {
        return [];
    }

    const metaTags: MetaTag[] = [];
    // Match <meta name="..." content="..." /> patterns
    const metaRegex = /<meta\s+name=["']([^"']+)["']\s+content=["']([^"']+)["']\s*\/?>/gi;
    let match;

    while ((match = metaRegex.exec(customHeadTags)) !== null) {
        metaTags.push({
            name: match[1],
            content: match[2],
        });
    }

    // Also try content before name pattern
    const metaRegexAlt = /<meta\s+content=["']([^"']+)["']\s+name=["']([^"']+)["']\s*\/?>/gi;
    while ((match = metaRegexAlt.exec(customHeadTags)) !== null) {
        metaTags.push({
            name: match[2],
            content: match[1],
        });
    }

    return metaTags;
}

/**
 * Helper function to convert MetaTag array to HTML string
 * This is useful for backward compatibility
 */
export function metaTagsToHtml(metaTags: MetaTag[]): string {
    if (!metaTags || !Array.isArray(metaTags)) {
        return "";
    }

    return metaTags
        .filter((tag) => tag.name && tag.content)
        .map((tag) => `<meta name="${tag.name}" content="${tag.content}" />`)
        .join("\n");
}
