"use client";

import { useEffect, useState } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import FAQClient from "./FAQClient";
import Loading from "../Components/Loading/page";

export default function FAQPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const response = await fetch(`${cmsUrl}/api/public/faq?t=${Date.now()}`, {
                    cache: "no-store",
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch FAQ");
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching FAQ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading text="Loading FAQs" fullScreen={true} />;
    }

    if (!data) {
        return <Loading text="Loading FAQs" fullScreen={true} />;
    }

    return <FAQClient faqData={data} />;
}
