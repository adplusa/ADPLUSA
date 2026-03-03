"use client";

import { useEffect, useState } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import ProjectsClient from "./ProjectsClient";
import Loading from "../Components/Loading/page";

export default function ProjectsPage() {
    const [projects, setProjects] = useState(null);
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const [projectsRes, pageRes] = await Promise.all([
                    fetch(`${cmsUrl}/api/public/projects`, {
                        cache: "no-store",
                    }),
                    fetch(`${cmsUrl}/api/public/projects-page`, {
                        cache: "no-store",
                    }),
                ]);

                if (!projectsRes.ok || !pageRes.ok)
                    throw new Error("Failed to fetch projects");

                const projectsResult = await projectsRes.json();
                const pageResult = await pageRes.json();

                if (projectsResult.success) {
                    setProjects(projectsResult.data);
                }
                if (pageResult.success) {
                    setPageData(pageResult.data);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading text="Loading Projects" fullScreen={true} />;
    }

    if (!projects) {
        return <Loading text="Loading Projects" fullScreen={true} />;
    }

    return <ProjectsClient projects={projects} pageData={pageData} />;
}
