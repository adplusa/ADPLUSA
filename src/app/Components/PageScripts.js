"use client";

import Script from "next/script";
import { useMemo, useEffect } from "react";

/**
 * PageScripts - Safely renders custom head tags from CMS
 * Handles scripts, meta tags, link tags, and styles
 * Uses Next.js Script component for scripts and dynamic DOM injection for other tags
 *
 * @param {Object} props
 * @param {string} props.customHeadTags - Raw HTML string containing head tags
 * @param {string} props.pageId - Unique identifier for this page's tags
 */
export default function PageScripts({ customHeadTags, pageId = "page" }) {
    const parsedTags = useMemo(() => {
        if (!customHeadTags)
            return {
                scripts: [],
                inlineScripts: [],
                metaTags: [],
                linkTags: [],
                styleTags: [],
            };

        const scripts = [];
        const inlineScripts = [];
        const metaTags = [];
        const linkTags = [];
        const styleTags = [];

        // Match external script tags with src attribute
        const srcScriptRegex =
            /\<script[^\>]*src=["']([^"']+)["'][^\>]*(?:\/\>|\>\<\/script\>)/gi;
        let match;
        while ((match = srcScriptRegex.exec(customHeadTags)) !== null) {
            scripts.push(match[1]);
        }

        // Match inline scripts (scripts with content between tags)
        const inlineScriptRegex =
            /\<script(?![^\>]*src=)[^\>]*\>([\s\S]*?)\<\/script\>/gi;
        while ((match = inlineScriptRegex.exec(customHeadTags)) !== null) {
            const content = match[1].trim();
            if (content) {
                inlineScripts.push(content);
            }
        }

        // Match meta tags
        const metaRegex = /\<meta\s+[^\>]*\/?>/gi;
        while ((match = metaRegex.exec(customHeadTags)) !== null) {
            metaTags.push(match[0]);
        }

        // Match link tags
        const linkRegex = /\<link\s+[^\>]*\/?>/gi;
        while ((match = linkRegex.exec(customHeadTags)) !== null) {
            linkTags.push(match[0]);
        }

        // Match style tags (inline CSS)
        const styleRegex = /\<style[^\>]*\>([\s\S]*?)\<\/style\>/gi;
        while ((match = styleRegex.exec(customHeadTags)) !== null) {
            styleTags.push(match[1].trim());
        }

        return { scripts, inlineScripts, metaTags, linkTags, styleTags };
    }, [customHeadTags]);

    // Inject meta, link, and style tags into document head
    useEffect(() => {
        const { metaTags, linkTags, styleTags } = parsedTags;
        const injectedElements = [];

        // Inject meta tags
        metaTags.forEach((tag, index) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = tag;
            const metaElement = tempDiv.firstChild;

            if (metaElement) {
                metaElement.setAttribute("data-page-id", pageId);
                metaElement.setAttribute("data-meta-index", String(index));
                document.head.appendChild(metaElement);
                injectedElements.push(metaElement);
            }
        });

        // Inject link tags
        linkTags.forEach((tag, index) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = tag;
            const linkElement = tempDiv.firstChild;

            if (linkElement) {
                linkElement.setAttribute("data-page-id", pageId);
                linkElement.setAttribute("data-link-index", String(index));
                document.head.appendChild(linkElement);
                injectedElements.push(linkElement);
            }
        });

        // Inject style tags
        styleTags.forEach((content, index) => {
            const styleElement = document.createElement("style");
            styleElement.setAttribute("data-page-id", pageId);
            styleElement.setAttribute("data-style-index", String(index));
            styleElement.textContent = content;
            document.head.appendChild(styleElement);
            injectedElements.push(styleElement);
        });

        // Cleanup function - remove injected elements when component unmounts
        return () => {
            injectedElements.forEach((element) => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        };
    }, [parsedTags, pageId]);

    const { scripts, inlineScripts } = parsedTags;

    // If no tags at all, return null
    if (
        !scripts.length &&
        !inlineScripts.length &&
        !parsedTags.metaTags.length &&
        !parsedTags.linkTags.length &&
        !parsedTags.styleTags.length
    ) {
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
