"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import { client } from "@/sanity/lib/client";
import urlFor from "../helpers/sanity";
import "./serviceInternalOne.css";

export const dynamic = "force-dynamic";

const ServicesPage = () => {
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "servicesOnePage"][0]`);
        console.log("✅ Fetched servicesOnePage data:", result);
        setData(result);
      } catch (error) {
        console.error("❌ Error fetching services data:", error);
      }
    };
    fetchData();
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Start autoplay when data is loaded
  useEffect(() => {
    if (data?.professionals?.length > 0) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [data]);

  // Handle infinite loop reset
  useEffect(() => {
    if (!data?.professionals || !Array.isArray(data.professionals)) return;
    const total = data.professionals.length;

    if (currentIndex === total) {
      setIsTransitioning(true);
      stopAutoPlay(); // Stop autoplay during transition

      // Wait for slide transition to complete
      const transitionTimer = setTimeout(() => {
        if (slideRef.current) {
          // Remove transition for instant reset
          slideRef.current.style.transition = "none";
          setCurrentIndex(0);

          // Force reflow and restore transition
          requestAnimationFrame(() => {
            if (slideRef.current) {
              slideRef.current.style.transition = "transform 0.5s ease";
              setIsTransitioning(false);
              startAutoPlay(); // Restart autoplay after reset
            }
          });
        }
      }, 500); // Match your CSS transition duration

      return () => {
        clearTimeout(transitionTimer);
        setIsTransitioning(false);
      };
    }
  }, [currentIndex, data]);

  const pauseAutoPlay = () => stopAutoPlay();

  const resumeAutoPlay = () => {
    if (!isTransitioning) {
      startAutoPlay();
    }
  };

  if (!data) return <div>Loading Services Page...</div>;

  // Create duplicated array for seamless carousel
  const professionals = [...data.professionals, ...data.professionals];
  console.log("Professionals loaded:", professionals);

  return (
    <>
      <Header />

      {/* Banner */}
      <section className="service-container">
        <div className="banner-text-container">
          <h1 className="banner-title">{data.bannerTitle}</h1>
          <button className="button">Hire an architect</button>

          <div className="popular-tags">
            <span className="tag" id="popular">
              Popular:
            </span>
            {data.bannerTags?.map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="stats">
            {data.trustedStats?.map((item, i) => (
              <p key={i}>
                <svg
                  className="tick"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {item.label}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="service-info">
        <div className="services-into-df">
          {data.servicesList?.map((service, i) => (
            <div key={i} className="service-info-df">
              <div className="service-left">
                <h1>{service.title}</h1>
                <p>{service.description}</p>
              </div>
              {service.image && (
                <div className="service-right">
                  <Image
                    src={urlFor(service.image).url()}
                    width={0}
                    height={0}
                    unoptimized
                    alt="img"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Key Activities */}
      <div className="key-container">
        <h1 className="key-heading">Key Activities and Outcomes</h1>
        <div className="key-cards-container">
          {data.keyActivities?.map((item, i) => (
            <div className="key-card" key={i}>
              <div className="key-asterisk">*</div>
              <h3 className="key-card-title">{item.title}</h3>
              <p className="key-card-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Specialization */}
      <section className="sepecialize">
        <div className="sepecialize-df">
          <div className="specialize-left">
            <button>{data.specialization?.buttonText}</button>
          </div>
          <div className="specialize-right">
            {data.specialization?.image && (
              <Image
                src={urlFor(data.specialization.image).url()}
                width={0}
                height={0}
                alt="Specialization"
                unoptimized
              />
            )}
          </div>
        </div>
      </section>

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
          <div className="image-wrapper">
            <div className="background">
              <Image
                src={urlFor(data.founderImage).url()}
                alt="Why Work With Us"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="cta-container-df">
        <div className="cta-container">
          <div className="cta-text">
            <h2>{data.finalCTA?.ctaTitle}</h2>
          </div>
          <button className="cta-button">{data.finalCTA?.ctaButton}</button>
        </div>
      </div>

      {/* Carousel */}
      <div className="professionals-section">
        <h1 className="professionals-heading">
          Explore Most Wanted Professionals
        </h1>
        <div
          className="carousel-container"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          <div
            className="carousel-slides"
            ref={slideRef}
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {professionals.map((pro, i) => (
              <div key={i} className="carousel-slide">
                <div className="professional-card">
                  <div className="image-container">
                    {pro.image ? (
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

      <Footer />
    </>
  );
};

export default ServicesPage;
