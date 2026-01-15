import { getProject, getProjects } from "@/lib/cms-client";
import ProjectClient from "./ProjectClient";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Link from "next/link";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = await getProject(slug, { revalidate: 60 });

    if (!project) {
        return {
            title: "Project Not Found | ADPL Consulting",
            description: "The requested project could not be found.",
        };
    }

    return {
        title: project.seoTitle || `${project.title} | ADPL Consulting`,
        description: project.seoDescription || project.description || `View ${project.title} project at ADPL Consulting`,
        openGraph: {
            title: project.seoTitle || `${project.title} | ADPL Consulting`,
            description: project.seoDescription || project.description,
            images: project.mainImage?.url ? [{ url: project.mainImage.url }] : [],
        },
    };
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const [project, allProjects] = await Promise.all([
        getProject(slug, { revalidate: 60 }),
        getProjects({ revalidate: 60 }),
    ]);

    if (!project) {
        return (
            <div className="internal-container">
                <Header />
                <div style={{ padding: "150px 20px", textAlign: "center" }}>
                    <h1>Project Not Found</h1>
                    <p>The project you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/projects" style={{ color: "blue", textDecoration: "underline" }}>
                        ← Back to Projects
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const otherProjects = allProjects?.filter((p) => p.slug !== slug) || [];

    return <ProjectClient project={project} otherProjects={otherProjects} slug={slug} />;
}
