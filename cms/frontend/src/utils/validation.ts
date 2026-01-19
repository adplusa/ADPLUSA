import { z } from "zod";

/**
 * Validates if a string is a valid URL format.
 * Returns true for valid URLs or empty strings (optional URLs).
 *
 * @param value - The string to validate
 * @returns true if valid URL or empty, false otherwise
 */
export function isValidUrl(value: string): boolean {
    if (!value || value.trim() === "") {
        return true; // Empty strings are valid (optional URLs)
    }

    // Allow relative URLs
    if (value.startsWith("/")) {
        return true;
    }

    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validates if a string is a valid slug format.
 * Slugs must contain only lowercase letters, numbers, and hyphens.
 *
 * @param value - The string to validate
 * @returns true if valid slug format, false otherwise
 */
export function isValidSlug(value: string): boolean {
    if (!value) {
        return false;
    }
    return /^[a-z0-9-]+$/.test(value);
}

// Zod Schemas

/**
 * Schema for validating slugs.
 * Must contain only lowercase letters, numbers, and hyphens.
 */
export const slugSchema = z
    .string()
    .min(1, "Slug is required")
    .regex(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
    );

/**
 * Schema for validating optional URLs.
 * Accepts valid URLs or empty strings.
 */
export const urlSchema = z
    .string()
    .refine((val) => isValidUrl(val), { message: "Please enter a valid URL" })
    .optional()
    .or(z.literal(""));

/**
 * Schema for a single meta tag
 */
export const metaTagSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    content: z.string().min(1, "Content is required").max(500, "Content must be 500 characters or less"),
});

/**
 * Type for a single meta tag
 */
export type MetaTag = z.infer<typeof metaTagSchema>;

/**
 * Schema for SEO fields with character limits.
 */
export const seoSchema = z.object({
    seoTitle: z.string().optional().or(z.literal("")),
    seoDescription: z.string().optional().or(z.literal("")),
    customHeadTags: z.string().optional().or(z.literal("")), // Kept for backward compatibility
    metaTags: z.array(metaTagSchema).optional().default([]),
});

/**
 * Type for SEO fields
 */
export type SeoFields = z.infer<typeof seoSchema>;
