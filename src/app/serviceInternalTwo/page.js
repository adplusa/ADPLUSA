"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import { client } from "@/sanity/lib/client";
import urlFor from "../helpers/sanity";
import "./serviceInternalTwo.css";

export const dynamic = "force-dynamic";

const ServicesPageTwo = () => {
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "servicesTwoPage"][0]`);
        setData(result);
      } catch (error) {
        console.error("❌ Error fetching servicesTwoPage:", error);
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    if (data?.professionals?.length > 0) startAutoPlay();
    return () => stopAutoPlay();
  }, [data, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    if (!data?.professionals) return;
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
      }, 500);

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

  if (!data) return <div>Loading Services Page Two...</div>;

  const professionals = [...data.professionals, ...data.professionals];

  return (
    <>
      <Header />

      {/* Banner Image */}
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
        <h1 className="key-heading">Key Activities and Outcomes</h1>
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

      {/* Professionals Carousel */}
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
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
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

      <Footer />
    </>
  );
};

export default ServicesPageTwo;
