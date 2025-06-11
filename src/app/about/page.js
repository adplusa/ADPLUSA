"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./about.css";
import Image from "next/image";
import gsap from "gsap";
import { client } from "../../sanity/lib/client";
import urlFor from "../helpers/sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Head from "next/head";

const About = () => {
  const textRef = useRef(null);
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!data) return; // Prevent null error

    document.title = data.seoTitle;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", data.seoDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Learn about our mission and team";
      document.head.appendChild(meta);
    }
  }, [data]); // Re-run when `data` becomes available

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const aboutPageData = await client.fetch('*[_type == "aboutPage"]');

        const resolveVideo = (ref) => {
          if (!ref) return null;
          return getFileAsset(
            { _ref: ref },
            {
              projectId: "5ippxm43",
              dataset: "production",
            }
          ).url;
        };

        console.log("Fetched About Page Data:", aboutPageData);

        setData(aboutPageData[0]);
      } catch (error) {
        console.error("Error fetching aboutPage data from Sanity:", error);
      }
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        rotation: 360,
        transformOrigin: "center",
        repeat: -1,
        duration: 8,
        ease: "linear",
      });
    }
  }, []);

  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Head>
        <title>{data.pageTitle || "About Us - My Website"}</title>
        <meta
          name="description"
          content={
            data.pageDescription || "Learn more about our company and mission."
          }
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content={data.pageTitle || "About Us - My Website"}
        />
        <meta
          property="og:description"
          content={
            data.pageDescription || "Learn more about our company and mission."
          }
        />
      </Head>
      <Header />

      <div className="about-container">
        <div className="about-content">
          <div className="home-about">
            <div className="about-us">
              <h2>{data.allowLightHeading}</h2>
              <div className="about-us-top">
                <div className="about-us-top-left">
                  <h1>{data.allowUsHeading}</h1>
                </div>
                <div className="about-us-top-right">
                  <h1>{data.allowRightHeading}</h1>

                  <PortableText value={data.paragraph} />
                  <span className="four-p">
                    {data.anchorLinks?.map((link, idx) => (
                      <a href={`#${link.targetId}`} key={idx}>
                        {link.label}
                      </a>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Blocks */}
          {data.sections?.map((section, idx) => (
            <div
              className={`about-content-${idx + 2}-row`}
              key={section.sectionId || idx}
            >
              {/* <div className="people-content" id={section.sectionId}> */}
              <div
                className="people-content"
                id={section.sectionId?.replace(/^#/, "")}
              >
                <h1>{section.title}</h1>
                <p>{section.body}</p>
              </div>
              {section?.image?.asset && (
                <div className="people-img">
                  <Image
                    src={urlFor(section.image).url()}
                    alt={`${section.title} image`}
                    width={600}
                    height={400}
                    unoptimized
                    priority
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* WhatsApp Button */}
      {data?.whatsappNumber && (
        <div className="whatsapp">
          <a
            className="btn-whatsapp-pulse"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/${data.whatsappNumber}/?text=${encodeURIComponent(
              data.whatsappText || ""
            )}`}
          >
            <Image
              src="/whatsapp.png"
              width={40}
              height={40}
              alt="Whatsapp icon"
              unoptimized
            />
          </a>
        </div>
      )}

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
                <input type="text" placeholder="Name" className="form-input" />
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

      {/* Upward Scroll Button */}
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
  );
};

export default About;
