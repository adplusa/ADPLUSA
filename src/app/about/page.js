"use client";

import { useEffect, useState } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import AboutClient from "./AboutClient";
import Loading from "../Components/Loading/page";

export default function AboutPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const response = await fetch(`${cmsUrl}/api/public/about`, {
                    cache: "no-store",
                });
                if (!response.ok) throw new Error("Failed to fetch about");
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching about:", error);
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

    return <AboutClient data={data} />;
}
