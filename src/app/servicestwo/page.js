"use client";

import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./servicetwo.css";
import { useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client"; // Correct Sanity client import
import Image from "next/image";
import Link from "next/link";
import urlFor from "../helpers/sanity";

const ServiceTwo = () => {
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);

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

      {/* Hero Section */}
      <section className="schematic-section">
        <div className="schematic-content">
          <h1>{data.hero?.title}</h1>
          <button className="demo-button">{data.hero?.buttonText}</button>

          <div className="schematic-features">
            {data.hero?.features?.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="comapany-trust">
        <div className="comapany-trust-df">
          <h1>{data.trustSection?.title}</h1>
          <p>{data.trustSection?.subtitle}</p>
        </div>
      </section>

      {/* Visual Concepts */}
      <section className="visual-concepts">
        {data.visualConcepts?.map((item, index) => (
          <div
            key={index}
            className={`row ${index % 2 !== 0 ? "reverse" : ""}`}
          >
            <div className="text">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <div className="image">
              {item.image && (
                <Image
                  src={urlFor(item.image).url()}
                  alt="Visual Concept"
                  width={500}
                  height={300}
                />
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Activities Outcomes */}
      <section className="activities-outcomes">
        <div className="heading">
          <h2>{data.activitiesOutcomes?.heading}</h2>
          <p>{data.activitiesOutcomes?.subheading}</p>
        </div>

        <div className="cards-grid">
          {data.activitiesOutcomes?.cards?.map((card, idx) => (
            <div key={idx} className="card">
              <div className="icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        <div className="card-cta">
          <div className="card-cta-df">
            <span>
              <button>{data.activitiesOutcomes?.cta?.buttonText}</button>
            </span>
            {data.activitiesOutcomes?.cta?.image && (
              <Image
                src={urlFor(data.activitiesOutcomes.cta.image).url()}
                alt="CTA Image"
                width={500}
                height={300}
              />
            )}
          </div>
        </div>
      </section>

      {/* Following Steps */}
      <section className="following-steps">
        <h2>{data.followingSteps?.title}</h2>
        <p>{data.followingSteps?.description}</p>
        <span>
          {data.followingSteps?.buttons?.map((btn, idx) => (
            <button key={idx}>{btn}</button>
          ))}
        </span>
      </section>

      {/* Why Work With Us */}
      <section className="why-work">
        <div className="content">
          <div className="text">
            <h2>{data.whyWorkWithUs?.title}</h2>

            {data.whyWorkWithUs?.features?.map((feature, idx) => (
              <div key={idx} className="feature">
                <div className="icon">{feature.icon}</div>
                <div className="info">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="image-wrapper">
            <div className="background">
              {data.whyWorkWithUs?.image && (
                <Image
                  src={urlFor(data.whyWorkWithUs.image).url()}
                  alt="Why Work Image"
                  width={500}
                  height={400}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="card-cta" id="card-cta-two">
        <div className="card-cta-df">
          <span>
            <button>{data.finalCTA?.buttonText}</button>
          </span>
          <span>
            <h1>{data.finalCTA?.title}</h1>
          </span>
        </div>
      </div>

      {/* Professionals Carousel */}
      <div className="professionals-container">
        <h2 className="section-title">
          Explore other Most Wanted Professionals
        </h2>

        <div className="carousel-wrapper">
          <button className="carousel-control prev" onClick={prevSlide}>
            &#10094;
          </button>

          <div className="carousel-viewport">
            <div
              ref={carouselRef}
              className="carousel-container"
              style={{
                transform: `translateX(${-activeIndex * 25}%)`,
                transition: isTransitioning
                  ? "transform 0.5s ease-in-out"
                  : "none",
              }}
            >
              {allCards.map((pro, index) => (
                <div key={index} className="professional-card">
                  <div className="card-inner">
                    <div
                      className="card-image"
                      style={{ backgroundColor: pro.bgColor }}
                    >
                      {pro.image && (
                        <Image
                          src={urlFor(pro.image).url()}
                          alt={pro.title}
                          width={0}
                          height={0}
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="card-content">
                      <h3
                        className="card-title"
                        style={{ color: pro.textColor }}
                      >
                        {pro.title}
                      </h3>
                      {pro.subtitle && (
                        <p className="card-subtitle">{pro.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-control next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>

        <div className="carousel-indicators">
          {professionals.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                index ===
                (activeIndex - startIndex + professionals.length) %
                  professionals.length
                  ? "active"
                  : ""
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ServiceTwo;
