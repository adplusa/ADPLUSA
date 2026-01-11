"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import urlFor from "@/app/helpers/sanity";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      try {
        const query = `*[_type match "projectInternalPage*" && slug.current == $slug][0]{
          title,
          introText,
          mainImage,
          mainImageDarkMode,
          projectDetails,
          projectImages,
          projectImagesTwo
        }`;
        const data = await client.fetch(query, { slug });
        setProject(data);
      } catch (err) {
        console.error("Error loading project:", err);
      }
    };
    fetchProject();
  }, [slug]);

  if (!project)
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>
    );

  return (
    <>
      <Header />
      <main className="project-detail-container">
        <h1 className="project-detail-title">{project.title}</h1>

        {project.mainImage && (
          <div className="project-detail-image">
            <Image
              src={urlFor(project.mainImage).url()}
              alt={project.title}
              width={1200}
              height={700}
              unoptimized
            />
          </div>
        )}

        {project.introText && (
          <div className="project-detail-intro">
            <p>{project.introText}</p>
          </div>
        )}

        {project.projectImages?.bottomImage && (
          <div className="project-detail-bottom">
            <Image
              src={urlFor(project.projectImages.bottomImage).url()}
              alt="Project bottom"
              width={1200}
              height={700}
              unoptimized
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
