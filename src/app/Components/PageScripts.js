"use client";

import Script from "next/script";
import Head from "next/head";
import { useMemo } from "react";

/**
 * MetaTag interface for structured meta tags
 * @typedef {Object} MetaTag
 * @property {string} name - The meta tag name attribute
 * @property {string} content - The meta tag content attribute
 */

/**
 * Generates HTML meta tag string from a MetaTag object
 * @param {MetaTag} metaTag - The meta tag object
 * @returns {string} HTML meta tag string
 */
export function generateMetaTagHtml(metaTag) {
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
 * @param {MetaTag[]} metaTags - Array of meta tag objects
 * @returns {string} HTML string containing all meta tags
 */
export function generateMetaTagsHtml(metaTags) {
    if (!Array.isArray(metaTags) || metaTags.length === 0) {
        return '';
    }
    return metaTags
        .filter(tag => tag && tag.name && tag.content)
        .map(generateMetaTagHtml)
        .join('\n');
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * PageScripts - Safely renders custom scripts and meta tags from CMS
 * Uses Next.js Script component to avoid hydration issues
 * Supports both legacy customHeadTags string and new metaTags array
 * 
 * @param {Object} props
 * @param {string} props.customHeadTags - Raw HTML string containing script tags (legacy)
 * @param {MetaTag[]} props.metaTags - Array of structured meta tag objects
 * @param {string} props.pageId - Unique identifier for this page's scripts
 */
export default function PageScripts({ customHeadTags, metaTags, pageId = "page" }) {
    const { scripts, inlineScripts } = useMemo(() => {
        if (!customHeadTags) return { scripts: [], inlineScripts: [] };
        
        const scripts = [];
        const inlineScripts = [];
        
        // Match script tags with src attribute
        const srcScriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*(?:\/>|><\/script>)/gi;
        let match;
        while ((match = srcScriptRegex.exec(customHeadTags)) !== null) {
            scripts.push(match[1]);
        }
        
        // Match inline scripts (scripts with content between tags)
        const inlineScriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
        while ((match = inlineScriptRegex.exec(customHeadTags)) !== null) {
            const content = match[1].trim();
            if (content) {
                inlineScripts.push(content);
            }
        }
        
        return { scripts, inlineScripts };
    }, [customHeadTags]);

    // Process structured metaTags array
    const validMetaTags = useMemo(() => {
        if (!Array.isArray(metaTags)) return [];
        return metaTags.filter(tag => tag && tag.name && tag.content);
    }, [metaTags]);

    const hasScripts = scripts.length > 0 || inlineScripts.length > 0;
    const hasMetaTags = validMetaTags.length > 0;

    if (!hasScripts && !hasMetaTags) {
        return null;
    }

    return (
        <>
            {/* Structured meta tags from metaTags array */}
            {hasMetaTags && (
                <Head>
                    {validMetaTags.map((tag, index) => (
                        <meta
                            key={`${pageId}-meta-${index}`}
                            name={tag.name}
                            content={tag.content}
                        />
                    ))}
                </Head>
            )}

            {/* External scripts from legacy customHeadTags */}
            {scripts.map((src, index) => (
                <Script 
                    key={`${pageId}-script-${index}`}
                    src={src}
                    strategy="afterInteractive"
                />
            ))}
            
            {/* Inline scripts from legacy customHeadTags */}
            {inlineScripts.map((content, index) => (
                <Script 
                    key={`${pageId}-inline-${index}`}
                    id={`${pageId}-inline-${index}`}
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            ))}
        </>
    );
}
