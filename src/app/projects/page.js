"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import ProjectsClient from "./ProjectsClient";
import Loading from "../Components/Loading/page";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerTarget = useRef(null);

    const LIMIT = 20;

    const fetchProjects = useCallback(
        async (page) => {
            try {
                const cmsUrl = getCMSApiUrl();
                const response = await fetch(
                    `${cmsUrl}/api/public/projects?page=${page}&limit=${LIMIT}&t=${Date.now()}`,
                    {
                        cache: "no-store",
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch projects");

                const result = await response.json();
                if (result.success) {
                    if (page === 1) {
                        setProjects(result.data);
                    } else {
                        setProjects((prev) => [...prev, ...result.data]);
                    }
                    setHasNextPage(result.pagination?.hasNextPage || false);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        },
        []
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const [projectsRes, pageRes] = await Promise.all([
                    fetch(
                        `${cmsUrl}/api/public/projects?page=1&limit=${LIMIT}&t=${Date.now()}`,
                        {
                            cache: "no-store",
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }
                    ),
                    fetch(`${cmsUrl}/api/public/projects-page?t=${Date.now()}`, {
                        cache: "no-store",
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    }),
                ]);

                if (!projectsRes.ok || !pageRes.ok)
                    throw new Error("Failed to fetch projects");

                const projectsResult = await projectsRes.json();
                const pageResult = await pageRes.json();

                if (projectsResult.success) {
                    setProjects(projectsResult.data);
                    setHasNextPage(projectsResult.pagination?.hasNextPage || false);
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

        fetchInitialData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !loadingMore &&
                    !loading
                ) {
                    setLoadingMore(true);
                    const nextPage = currentPage + 1;
                    setCurrentPage(nextPage);
                    fetchProjects(nextPage).finally(() => setLoadingMore(false));
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasNextPage, loadingMore, loading, currentPage, fetchProjects]);

    if (loading) {
        return <Loading text="Loading Projects" fullScreen={true} />;
    }

    if (projects.length === 0) {
        return <Loading text="Loading Projects" fullScreen={true} />;
    }

    return (
        <>
            <ProjectsClient projects={projects} pageData={pageData} />
            <div ref={observerTarget} style={{ height: "20px", margin: "20px 0" }}>
                {loadingMore && <Loading text="Loading more projects" fullScreen={false} />}
            </div>
        </>
    );
}
