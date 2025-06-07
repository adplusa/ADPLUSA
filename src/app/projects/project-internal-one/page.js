"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import "./internal-one.css";
import urlFor from "@/app/helpers/sanity";

const InternalOne = () => {
  const [data, setData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = await client.fetch(
          `*[_type == "projectInternalPageOne"]`
        );
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
    <div className="internal-container">
      <Header />
      <div className="internal-section-one">
        <div className="internal-section-one-top">
          <h1>{data?.[0]?.title}</h1>

          {data?.[0]?.mainImage?.asset && (
            <Image
              src={urlFor(data[0].mainImage).url()}
              alt="Internal-img"
              width={1200}
              height={600}
              unoptimized
              priority
            />
          )}
        </div>

        <div className="internal-section-one-bottom">
          <div className="internal-section-one-bottom-left">
            <p>{data?.[0]?.introText}</p>

            {data?.[0]?.moreContent?.map((paragraph, idx) => (
              <p
                key={idx}
                className={`load-content ${isExpanded ? "visible" : "hidden"}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="internal-section-one-bottom-right">
            {data?.[0]?.projectDetails?.map((detail, idx) => (
              <div
                key={idx}
                className={`load-content-li ${idx < 4 ? "visible" : isExpanded ? "visible" : ""}`}
              >
                <p>{detail?.label}</p>
                <ul>
                  {detail?.items?.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      {item?.startsWith?.("http") ? (
                        <a
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item}
                        </a>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="internal-section-one-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <button>
            {isExpanded ? "Less Information" : "More Information"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className={`bi ${isExpanded ? "bi-x-lg" : "bi-plus"}`}
              viewBox="0 0 16 16"
            >
              {isExpanded ? (
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              ) : (
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              )}
            </svg>
          </button>
        </div>
        <hr id="internal-line" />
      </div>

      {/* Section Two */}
      <div className="internal-section-two">
        <div className="internal-section-two-top">
          <div className="internal-section-two-top-imgs">
            {data?.[0]?.projectImages?.topImages?.map((img, idx) =>
              img?.asset ? (
                <Image
                  key={idx}
                  src={urlFor(img).url()}
                  alt={`Top image ${idx + 1}`}
                  width={600}
                  height={400}
                  unoptimized
                />
              ) : null
            )}
          </div>
        </div>

        <div className="internal-section-two-bottom">
          {data?.[0]?.projectImages?.bottomImage?.asset && (
            <Image
              src={urlFor(data[0].projectImages.bottomImage).url()}
              alt="Bottom image"
              width={1200}
              height={600}
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Section Three */}
      <div className="internal-section-two">
        <div className="internal-section-two-top">
          <div className="internal-section-two-top-imgs">
            {data?.[0]?.projectImagesTwo?.topImagesTwo?.map((img, idx) =>
              img?.asset ? (
                <Image
                  key={idx}
                  src={urlFor(img).url()}
                  alt={`Top image ${idx + 1}`}
                  width={600}
                  height={400}
                  unoptimized
                />
              ) : null
            )}
          </div>
        </div>

        <div className="internal-section-two-bottom">
          {data?.[0]?.projectImagesTwo?.bottomImageTwo?.asset && (
            <Image
              src={urlFor(data[0].projectImagesTwo.bottomImageTwo).url()}
              alt="Bottom image"
              width={1200}
              height={600}
              unoptimized
            />
          )}
        </div>
      </div>

      <Footer />

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
          ></Image>
        </a>
      </div>

      <div className="enquire">
        <button>Enquire Now</button>
      </div>

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

export default InternalOne;
