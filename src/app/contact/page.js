"use client";

import { useEffect, useState } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import ContactClient from "./ContactClient";
import Loading from "../Components/Loading/page";

export default function ContactPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const response = await fetch(`${cmsUrl}/api/public/contact?t=${Date.now()}`, {
                    cache: "no-store",
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch contact");
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching contact:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading text="Loading" fullScreen={true} />;
    }

    if (!data) {
        return <Loading text="Loading" fullScreen={true} />;
    }

    return <ContactClient data={data} />;
}
