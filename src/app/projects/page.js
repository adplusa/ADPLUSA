"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import urlFor from "../helpers/sanity";
import "./project.css";

const Project = () => {
  const textRef = useRef(null);
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // 🌙 Dark / Light mode listener
  useEffect(() => {
    const updateMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };
    updateMode();
    const observer = new MutationObserver(updateMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // 🧠 Fetch and Filter Sanity Projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch all docs whose type starts with "projectInternalPage"
        const fetched = await client.fetch(
          `*[_type match "projectInternalPage*"]{
            _id,
            _type,
            title,
            slug,
            introText,
            mainImage,
            mainImageDarkMode,
            projectImages,
            _createdAt
          }`
        );

        // 2️⃣ Filter out docs that have no title or image or content
        const filtered = fetched.filter(
          (item) =>
            (item.mainImage || item.mainImageDarkMode) &&
            (item.introText || item.projectImages)
        );

        // 3️⃣ Sort by internal page number (projectInternalPageOne → Two → ...)
        const sorted = filtered.sort((a, b) => {
          const getNum = (typeName) => {
            const match = typeName.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getNum(a._type) - getNum(b._type);
        });

        setData(sorted);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, []);

  // 🆙 Scroll to Top
  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ➕ Load More
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (!data || data.length === 0)
    return <div className="loading">Loading projects...</div>;

  return (
    <>
      <Header />

      <div className="project-container">
        <div className="project-content">
          <div className="project-heading">
            <h1 ref={textRef}>Our Projects</h1>
            <hr id="project-hr" />
          </div>

          {/* 🏗️ Project Grid */}
          <div className="project-grid">
            {data.slice(0, visibleCount).map((item, index) => (
              <Link
                href={
                  item.slug?.current ? `/projects/${item.slug.current}` : "#"
                }
                key={index}
                className="project-tile"
              >
                <div className="image-wrapper-pr">
                  <Image
                    src={
                      isDarkMode && item.mainImageDarkMode
                        ? urlFor(item.mainImageDarkMode).url()
                        : item.mainImage
                          ? urlFor(item.mainImage).url()
                          : "/placeholder.jpg"
                    }
                    alt={item.title || "Project Image"}
                    fill
                    unoptimized
                    priority
                  />
                </div>
                <p className="image-title">{item.title}</p>
              </Link>
            ))}
          </div>

          {/* 🔽 Load More Button */}
          {visibleCount < data.length && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </div>

        <Footer />

        {/* 💬 WhatsApp Button */}
        <div className="whatsapp">
          <a
            className="btn-whatsapp-pulse"
            target="_blank"
            href="https://wa.me/919910085603/?text=I%20would%20like%20to%20know%20about%20ADPL%20Consulting%20LLC%20!"
          >
            <Image
              src={"/whatsapp.png"}
              width={40}
              height={40}
              alt="Whatsapp-img"
              unoptimized
            />
          </a>
        </div>

        {/* 📩 Enquiry Form */}
        <div className="enquire">
          <button onClick={() => setShowForm(true)}>Enquire Now</button>
        </div>

        {showForm && (
          <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
            <div
              className="enquiry-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="enquiry-box">
                <div className="close-icon" onClick={() => setShowForm(false)}>
                  ✕
                </div>
                <h2 className="title">Quick Query</h2>
                <p className="subtitle">
                  If you have any queries, we will be pleased to assist you.
                </p>
                <form>
                  <input
                    type="text"
                    placeholder="Name"
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Mobile No."
                    className="form-input"
                  />
                  <select className="form-input">
                    <option>Select Type</option>
                    <option>General</option>
                    <option>Support</option>
                    <option>Sales</option>
                  </select>
                  <textarea
                    placeholder="Query"
                    className="form-input"
                    rows="3"
                  ></textarea>

                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ⬆ Scroll Up Button */}
        <div className="upward" onClick={upwardHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Project;
