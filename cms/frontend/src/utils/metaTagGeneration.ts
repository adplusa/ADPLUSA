/**
 * Meta Tag Generation Utilities
 * 
 * These utilities handle the generation of HTML meta tags from structured MetaTag objects.
 * Used by both the CMS frontend and Next.js frontend for consistent meta tag handling.
 */

/**
 * MetaTag interface for structured meta tags
 */
export interface MetaTag {
    name: string;
    content: string;
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeHtml(str: string): string {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Generates HTML meta tag string from a MetaTag object
 * @param metaTag - The meta tag object
 * @returns HTML meta tag string
 */
export function generateMetaTagHtml(metaTag: MetaTag): string {
    if (!metaTag || !metaTag.name || !metaTag.content) {
        return '';
    }
    // Escape HTML special characters to prevent XSS
    const escapedName = escapeHtml(metaTag.name);
    const escapedContent = escapeHtml(metaTag.content);
    return `<meta name="${escapedName}" content="${escapedContent}" />`;
}

/**
 * Generates HTML string from an array of MetaTag objects
 * @param metaTags - Array of meta tag objects
 * @returns HTML string containing all meta tags
 */
export function generateMetaTagsHtml(metaTags: MetaTag[]): string {
    if (!Array.isArray(metaTags) || metaTags.length === 0) {
        return '';
    }
    return metaTags
        .filter(tag => tag && tag.name && tag.content)
        .map(generateMetaTagHtml)
        .join('\n');
}

/**
 * Parses HTML string to extract meta tags
 * @param html - HTML string containing meta tags
 * @returns Array of MetaTag objects
 */
export function parseMetaTagsFromHtml(html: string): MetaTag[] {
    if (!html || typeof html !== 'string') {
        return [];
    }
    
    const metaTags: MetaTag[] = [];
    // Match meta tags with name and content attributes
    const metaTagRegex = /<meta\s+name="([^"]+)"\s+content="([^"]+)"\s*\/?>/gi;
    let match;
    
    while ((match = metaTagRegex.exec(html)) !== null) {
        metaTags.push({
            name: unescapeHtml(match[1]),
            content: unescapeHtml(match[2]),
        });
    }
    
    return metaTags;
}

/**
 * Unescapes HTML entities back to their original characters
 * @param str - String with HTML entities
 * @returns Unescaped string
 */
export function unescapeHtml(str: string): string {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

/**
 * Validates a MetaTag object
 * @param metaTag - The meta tag to validate
 * @returns true if valid, false otherwise
 */
export function isValidMetaTag(metaTag: unknown): metaTag is MetaTag {
    if (!metaTag || typeof metaTag !== 'object') return false;
    const tag = metaTag as Record<string, unknown>;
    return (
        typeof tag.name === 'string' &&
        typeof tag.content === 'string' &&
        tag.name.trim().length > 0 &&
        tag.content.trim().length > 0
    );
}

/**
 * Counts the number of meta tags in an HTML string
 * @param html - HTML string containing meta tags
 * @returns Number of meta tags found
 */
export function countMetaTagsInHtml(html: string): number {
    if (!html || typeof html !== 'string') return 0;
    const matches = html.match(/<meta\s+name="[^"]+"\s+content="[^"]+"\s*\/?>/gi);
    return matches ? matches.length : 0;
}
