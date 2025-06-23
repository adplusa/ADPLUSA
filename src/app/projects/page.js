"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { client } from "@/sanity/lib/client";
import urlFor from "../helpers/sanity";
import "./project.css";

const Project = () => {
  const textRef = useRef(null);
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // 🧠 Fetch Sanity CMS data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = await client.fetch(`*[_type == "projectPage"]`);
        setData(fetched);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;

    const pageData = data[0];
    document.title = pageData.seoTitle;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", pageData.seoDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Learn about our mission and team";
      document.head.appendChild(meta);
    }
  }, [data]);

  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Header />

      <div className="project-container">
        <div className="project-content">
          <div className="project-heading">
            <h1 ref={textRef}>{data[0].heading}</h1>
            <hr id="project-hr" />
          </div>

          <div className="project-grid">
            {data[0]?.projects?.map(
              (item, index) =>
                item?.image?.asset && (
                  <Link
                    href={item.link || "#"}
                    key={index}
                    className="project-tile"
                  >
                    <div className="image-wrapper-pr">
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.title || "Project Image"}
                        fill
                        unoptimized
                        priority
                      />
                    </div>
                    <p className="image-title">{item.title}</p>
                  </Link>
                )
            )}
          </div>
        </div>

        <Footer />

        {/* WhatsApp Button */}
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

        {/* Enquire Button */}
        <div className="enquire">
          <button onClick={() => setShowForm(true)}>Enquire Now</button>
        </div>
        {showForm && (
          <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
            <div
              className="enquiry-container"
              onClick={(e) => e.stopPropagation()} // Prevent close on form click
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

        {/* Scroll Up Button */}
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
