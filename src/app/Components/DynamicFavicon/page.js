"use client";

import { useEffect, useState } from "react";
import { getGeneralSettings } from "@/lib/cms-client";

const DEFAULT_FAVICON = "/icon.png";

/**
 * Dynamic Favicon component that loads the favicon from CMS
 * Falls back to the default favicon if CMS is unavailable
 */
export default function DynamicFavicon() {
    const [faviconUrl, setFaviconUrl] = useState(DEFAULT_FAVICON);

    useEffect(() => {
        const fetchFavicon = async () => {
            try {
                const settings = await getGeneralSettings();
                if (settings?.favicon?.url) {
                    setFaviconUrl(settings.favicon.url);
                }
            } catch (error) {
                console.error("Failed to fetch favicon from CMS:", error);
                // Keep default favicon
            }
        };
        fetchFavicon();
    }, []);

    useEffect(() => {
        // Update the favicon link element
        const updateFavicon = () => {
            // Find existing favicon links
            const existingLinks =
                document.querySelectorAll("link[rel*='icon']");

            // Remove existing favicon links
            existingLinks.forEach((link) => link.remove());

            // Create new favicon link
            const link = document.createElement("link");
            link.rel = "icon";
            link.type = faviconUrl.endsWith(".ico")
                ? "image/x-icon"
                : "image/png";
            link.href = faviconUrl;
            document.head.appendChild(link);

            // Also add apple-touch-icon
            const appleLink = document.createElement("link");
            appleLink.rel = "apple-touch-icon";
            appleLink.href = faviconUrl;
            document.head.appendChild(appleLink);
        };

        updateFavicon();
    }, [faviconUrl]);

    // This component doesn't render anything visible
    return null;
}
