"use client";

import Script from "next/script";
import { useMemo } from "react";

/**
 * PageScripts - Safely renders custom scripts from CMS
 * Uses Next.js Script component to avoid hydration issues
 * 
 * @param {Object} props
 * @param {string} props.customHeadTags - Raw HTML string containing script tags
 * @param {string} props.pageId - Unique identifier for this page's scripts
 */
export default function PageScripts({ customHeadTags, pageId = "page" }) {
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

    if (!scripts.length && !inlineScripts.length) {
        return null;
    }

    return (
        <>
            {/* External scripts */}
            {scripts.map((src, index) => (
                <Script 
                    key={`${pageId}-script-${index}`}
                    src={src}
                    strategy="afterInteractive"
                />
            ))}
            
            {/* Inline scripts */}
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
