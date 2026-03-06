"use client";

import { useEffect, useState } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import HomeClient from "./HomeClient";
import Loading from "./Components/Loading/page";

export default function HomePage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const response = await fetch(`${cmsUrl}/api/public/homepage?t=${Date.now()}`, {
                    cache: "no-store",
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch homepage");
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching homepage:", error);
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

    return <HomeClient homepageData={data} />;
}
