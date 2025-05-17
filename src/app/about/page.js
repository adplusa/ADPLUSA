"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./about.css";
import Image from "next/image";
import gsap from "gsap";
import { client } from "../../sanity/lib/client";
import urlFor from "../helpers/sanity";

const About = () => {
  const textRef = useRef(null);
  const [data, setData] = useState(null);

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
      <Header />

      <div className="about-container">
        <div className="about-content">
          {/* Top Intro Section */}
          <div className="about-content-first-row">
            <div className="about-content-first-row-left">
              <h1>{data.mainTitle || "About"}</h1>
            </div>
            <div className="about-content-first-row-right">
              <h2>{data.subheading}</h2>
              {data.introParagraphs?.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
              <span className="four-p">
                {data.anchorLinks?.map((link, idx) => (
                  <a href={`#${link.targetId}`} key={idx}>
                    {link.label}
                  </a>
                ))}
              </span>
            </div>
          </div>

          {/* Section Blocks */}
          {data.sections?.map((section, idx) => (
            <div
              className={`about-content-${idx + 2}-row`}
              key={section.sectionId || idx}
            >
              <div className="people-content" id={section.sectionId}>
                <h1>{section.title}</h1>
                <p>{section.body}</p>
              </div>
              <div className="people-img">
                {section.image && (
                  <Image
                    src={urlFor(section.image).url()}
                    alt={`${section.title} image`}
                    width={600}
                    height={400}
                    unoptimized
                    priority
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* WhatsApp Button */}
      {data.whatsappNumber && (
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
        <button>{data.enquiryButtonText || "Enquire Now"}</button>
      </div>

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
