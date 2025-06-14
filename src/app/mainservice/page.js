"use client";

import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./servicetwo.css";
import { useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client"; // Correct Sanity client import
import Image from "next/image";
import Link from "next/link";
import urlFor from "../helpers/sanity";
import gsap from "gsap";

const ServiceTwo = () => {
  const textRef = useRef(null);

  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

  // const servicesData = [
  //   {
  //     title: "Remote Executive Assistant",
  //     category: "Services",
  //     image: "/cad-1.webp",
  //   },
  //   {
  //     title: "MEP Engineer",
  //     category: "Services",
  //     image: "/cad-2.webp",
  //   },
  //   {
  //     title: "Construction Documentation",
  //     category: "Services",
  //     image: "/cad-4.webp",
  //   },
  //   {
  //     title: "CAD Outsourcing",
  //     category: "Services",
  //     image: "/cad-3.webp",
  //   },

  //   {
  //     title: "Bim Services",
  //     category: "Services",
  //     image: "/cad-2.webp",
  //   },

  //   {
  //     title: "MEP Engineer",
  //     category: "Services",
  //     image: "/cad-3.webp",
  //   },

  //   {
  //     title: "Presenting Drawing",
  //     category: "Services",
  //     image: "/cad-4.webp",
  //   },

  //   {
  //     title: "3D Visualization",
  //     category: "Services",
  //     image: "/cad-5.webp",
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await client.fetch('*[_type == "serviceTwoPage"]');
        console.log("Fetched Service Two Data:", fetchedData);

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

        setData(fetchedData[0]);
      } catch (error) {
        console.error("Error fetching Service Two data:", error);
      }
    };

    fetchData();
  }, []);

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

  // Infinite Carousel Logic
  const professionals = data?.professionals || [];
  const allCards = [...professionals, ...professionals, ...professionals];
  const startIndex = professionals.length;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  useEffect(() => {
    if (!carouselRef.current) return;

    if (activeIndex === allCards.length - professionals.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(startIndex);
      }, 500);
    }

    if (activeIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(allCards.length - professionals.length - 1);
      }, 500);
    }
  }, [activeIndex, allCards.length, professionals.length, startIndex]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setActiveIndex(index + startIndex);
  };

  if (!data) return <div>Loading...</div>; // Show loading while data is fetched

  return (
    <>
      <Header />

      {data.serviceBannerImage?.asset && (
        <section
          className="schematic-section"
          style={{
            backgroundImage: `url(${urlFor(data.serviceBannerImage).url()})`,
          }}
        ></section>
      )}

      {/* Trust Section */}
      <section className="comapany-trust">
        <div className="comapany-trust-df">
          <h1>{data?.trustSection?.title}</h1>
          <p>{data?.trustSection?.subtitle}</p>
        </div>
      </section>

      <div className="feature-section">
        <div className="feature-section-df">
          <div className="feature-box">
            <h1>{data?.trustIconsHeading}</h1>
            {data?.serviceRelatedIcon?.length > 0 && (
              <div className="features-name">
                {data.serviceRelatedIcon.map((related, index) => {
                  if (!related?.serviceRelatedImg?.asset) return null; // Skip empty icons

                  return (
                    <div key={index} className="service-related-item">
                      <Image
                        src={urlFor(related.serviceRelatedImg).url()}
                        alt={related.serviceRelatedName || "Service Icon"}
                        width={70}
                        height={70}
                        unoptimized
                        priority
                      />
                      {related.serviceRelatedNumber && (
                        <p>{related.serviceRelatedNumber}</p>
                      )}
                      {related.serviceRelatedName && (
                        <h3>{related.serviceRelatedName}</h3>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="home_services">
        <h1>{data.serviceHeading}</h1>
        <div className="home_services_box">
          {data.serviceBox?.map((service, index) => (
            <Link href={service.boxUrl || "#"} key={index}>
              <div className="service-box-home">
                <div className="service-image">
                  {service?.serviceBoxImg?.asset ? (
                    <Image
                      src={urlFor(service.serviceBoxImg).url()}
                      alt={service.serviceBoxTitle || "Service"}
                      width={400}
                      height={200}
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{ width: 400, height: 200, background: "#eee" }}
                    >
                      {/* Optional fallback or placeholder */}
                      <p style={{ textAlign: "center", paddingTop: "80px" }}>
                        No Image
                      </p>
                    </div>
                  )}
                </div>
                <h2>{service.serviceBoxTitle}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Work With Us */}
      <section className="why-work-main-service-page">
        <div className="content-two-main-service-page">
          <div className="text-main-service-page">
            <h2>{data?.whyWorkWithUs?.title}</h2>

            {data?.whyWorkWithUs?.features?.map((feature, idx) => (
              <div key={idx} className="feature-main-service-page">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-check2"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"></path>
                </svg>
                <div className="info-main-service-page">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="image-wrapper-main-service-page">
            {data?.whyWorkWithUs?.image?.asset && (
              <Image
                src={urlFor(data.whyWorkWithUs.image).url()}
                alt="Why Work Image"
                width={500}
                height={400}
              />
            )}
          </div>
        </div>
      </section>

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
          ></Image>
        </a>
      </div>

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
    </>
  );
};

export default ServiceTwo;
