"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCMSApiUrl } from "@/lib/cms-client";
import ProjectClient from "./ProjectClient";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Link from "next/link";
import Loading from "@/app/Components/Loading/page";

export default function ProjectPage() {
    const params = useParams();
    const slug = params?.slug;
    const [project, setProject] = useState(null);
    const [otherProjects, setOtherProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const [projectRes, projectsRes] = await Promise.all([
                    fetch(`${cmsUrl}/api/public/projects/${slug}`, {
                        cache: "no-store",
                    }),
                    fetch(`${cmsUrl}/api/public/projects`, {
                        cache: "no-store",
                    }),
                ]);

                if (!projectRes.ok) {
                    setNotFound(true);
                    return;
                }

                const projectResult = await projectRes.json();
                const projectsResult = await projectsRes.json();

                if (projectResult.success) {
                    setProject(projectResult.data);
                }
                if (projectsResult.success) {
                    const others = projectsResult.data.filter(
                        (p) => p.slug !== slug
                    );
                    setOtherProjects(others);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return <Loading text="Loading" fullScreen={true} />;
    }

    if (notFound || !project) {
        return (
            <div className="internal-container">
                <Header />
                <div style={{ padding: "150px 20px", textAlign: "center" }}>
                    <h1>Project Not Found</h1>
                    <p>
                        The project you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link
                        href="/projects"
                        style={{ color: "blue", textDecoration: "underline" }}
                    >
                        ← Back to Projects
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <ProjectClient
            project={project}
            otherProjects={otherProjects}
            slug={slug}
        />
    );
}
