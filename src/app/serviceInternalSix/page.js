"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import { client } from "@/sanity/lib/client";
import urlFor from "../helpers/sanity";
import "./serviceInternalSix.css";

export const dynamic = "force-dynamic";

const ServicesPageSix = () => {
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile state based on window width
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Add resize event listener

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "servicesSixPage"][0]`);
        setData(result);
      } catch (error) {
        console.error("❌ Error fetching servicesSixPage:", error);
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

  const nextSlide = () => {
    if (!isTransitioning) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 3000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  // Start autoplay on load
  useEffect(() => {
    if (data?.professionals?.length > 0) startAutoPlay();
    return () => stopAutoPlay();
  }, [data, startAutoPlay, stopAutoPlay]);

  // Handle infinite scroll logic
  useEffect(() => {
    if (!data?.professionals?.length) return;
    const total = data.professionals.length;

    if (currentIndex === total) {
      setIsTransitioning(true);
      stopAutoPlay();

      const timer = setTimeout(() => {
        if (slideRef.current) {
          slideRef.current.style.transition = "none";
          setCurrentIndex(0);

          requestAnimationFrame(() => {
            if (slideRef.current) {
              slideRef.current.style.transition = "transform 0.5s ease";
              setIsTransitioning(false);
              startAutoPlay();
            }
          });
        }
      }, 500); // Duration should match CSS transition

      return () => {
        clearTimeout(timer);
        setIsTransitioning(false);
      };
    }
  }, [currentIndex, data, stopAutoPlay, startAutoPlay]);

  const pauseAutoPlay = () => stopAutoPlay();
  const resumeAutoPlay = () => {
    if (!isTransitioning) startAutoPlay();
  };

  if (!data) return <div>Loading Services Page Six...</div>;

  const professionals = [...data.professionals, ...data.professionals];

  return (
    <>
      <Header />

      {/* Banner */}
      {data.serviceBannerImage?.asset && (
        <section
          className="service-container"
          style={{
            backgroundImage: `url(${urlFor(data.serviceBannerImage).url()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Service Info */}
      <section className="service-info">
        <div className="services-into-df">
          {data.servicesList?.map((service, i) => (
            <div key={i} className="service-info-df">
              <div className="service-left">
                <h1>{service.title}</h1>
                <p>{service.description}</p>
              </div>
              {service.image?.asset && (
                <div className="service-right">
                  <Image
                    src={urlFor(service.image).url()}
                    width={0}
                    height={0}
                    unoptimized
                    alt={service.title || "Service Image"}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Key Activities */}
      <div className="key-container">
        <h1 className="key-heading">Key Activities and Outcome</h1>
        <div className="key-cards-container">
          {data.keyActivities?.map((item, i) => (
            <div key={i} className="key-card">
              <div className="key-asterisk">*</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Work With Us */}
      <section className="why-work">
        <div className="content-two">
          <div className="text">
            <h2>Why Work With Us?</h2>
            {data.reasonsToWork?.map((reason, i) => (
              <div className="feature" key={i}>
                <div className="icon">✔️</div>
                <div className="info">
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
          {data.founderImage?.asset && (
            <div className="image-wrapper">
              <div className="background">
                <Image
                  src={urlFor(data.founderImage).url()}
                  alt="Why Work With Us"
                  width={500}
                  height={400}
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Carousel */}
      <div className="professionals-section-internals">
        <h1 className="professionals-heading-internals">
          Explore More Services
        </h1>
        <div
          className="carousel-container-internals"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          <div
            className="carousel-slides-internals"
            ref={slideRef}
            // style={{ transform: `translateX(-${currentIndex * 25}%)` }}
            style={{
              transform: `translateX(-${currentIndex * (isMobile ? 100 : 25)}%)`,
              transition: "transform 0.5s ease", // Smooth transition
            }}
          >
            {professionals.map((pro, i) => (
              <div key={i} className="carousel-slide-internals">
                <div className="professional-card-internals">
                  <div className="image-container-internals">
                    {pro?.image?.asset ? (
                      <Image
                        src={urlFor(pro.image).url()}
                        alt={pro.title || "Professional"}
                        width={300}
                        height={200}
                        unoptimized
                      />
                    ) : (
                      <div
                        style={{
                          width: 300,
                          height: 200,
                          backgroundColor: "#eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p>No Image</p>
                      </div>
                    )}
                  </div>
                  <h3>{pro.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
      <Footer />
    </>
  );
};

export default ServicesPageSix;
