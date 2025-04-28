"use client";

import Header from "../Components/Header/page";
import "./servicetwo.css";
import Image from "next/image";
import Footer from "../Components/Footer/page";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const ServiceTwo = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);

  const professionals = [
    {
      title: "Construction Documentation",
      subtitle: "Services",
      image: "/cad-1.webp",
      bgColor: "#400a3a", // Dark purple
      textColor: "#ffffff",
    },
    {
      title: "MEP Engineer",
      subtitle: "Services",
      image: "/cad-2.webp",
      bgColor: "#e8d1cb", // Light pink
      textColor: "#333333",
    },
    {
      title: "CAD Outsourcing",
      subtitle: "Services",
      image: "/cad-3.webp",
      bgColor: "#143e3a", // Dark green
      textColor: "#ffffff",
    },
    {
      title: "Landscape Design",
      subtitle: "Services",
      image: "/cad-4.webp",
      bgColor: "#f2e9e4", // Light beige
      textColor: "#333333",
    },
    {
      title: "Landscape Design",
      subtitle: "Services",
      image: "/cad-5.webp",
      bgColor: "#f2e9e4", // Light beige
      textColor: "#333333",
    },
  ];

  const allCards = [...professionals, ...professionals, ...professionals];
  const startIndex = professionals.length;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Handle the infinite scrolling logic
  useEffect(() => {
    if (!carouselRef.current) return;

    if (activeIndex === allCards.length - professionals.length) {
      // If we reach the end of duplicated items, jump to the original set without animation
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(startIndex);
      }, 500);
    }

    if (activeIndex === 0) {
      // If we go before the start, jump to the end of original set without animation
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(allCards.length - professionals.length - 1);
      }, 500);
    }
  }, [activeIndex, allCards.length, professionals.length, startIndex]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prevIndex) => prevIndex - 1);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setActiveIndex(index + startIndex);
  };
  return (
    <>
      <Header />
      <section className="schematic-section">
        <div className="schematic-content">
          <h1>Schematic Design Architecture</h1>
          <button className="demo-button">Book a demo!</button>

          <div className="schematic-features">
            <div className="feature-item">
              <span className="feature-icon">🏅</span>
              <span>Top tier professionals</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🕒</span>
              <span>Your same timezone</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span>US experience</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">❌</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <section className="comapany-trust">
        <div className="comapany-trust-df">
          <h1>+110 COMPANIES TRUST US</h1>
          <p>and we’ve placed more than 400 professionals</p>
        </div>
      </section>

      <section className="visual-concepts">
        <div className="row">
          <div className="text">
            <h2>Transforming Ideas into Visual Concepts</h2>
            <p>
              At WorldTeams, we care about the initial stage of the construction
              process by selecting the best talents who convert ideas into rough
              sketches, diagrams, and basic layouts. The primary goal of the
              Schematic Design phase is to explore and define a projects overall
              design direction while considering the clients requirements,
              functional needs, site conditions, and budget constraints.
            </p>
          </div>
          <div className="image">
            <Image
              src={"./service-img-1.webp"}
              alt="img"
              width={0}
              height={0}
              unoptimized
            ></Image>
          </div>
        </div>

        <div className="row reverse">
          <div className="image">
            <Image
              src={"./service-img-2.webp"}
              alt="img"
              width={0}
              height={0}
              unoptimized
            ></Image>
          </div>
          <div className="text">
            <p>
              During the Schematic Design phase, remote architects and designer
              work closely with clients to develop a clear understanding of the
              projects goals, objectives, and aesthetic preferences. This phase
              involves creating preliminary design options that illustrate
              various conceptual approaches to the project. These options may
              include rough floor plans, elevations, basic 3D models, and
              conceptual diagrams to help convey the design ideas.
            </p>
          </div>
        </div>
      </section>

      <section className="activities-outcomes">
        <div className="heading">
          <h2>Key activities and outcomes</h2>
          <p>of the Schematic Design Architecture phase typically include:</p>
        </div>

        <div className="cards-grid">
          <div className="card">
            <div className="icon">✱</div>
            <h3>Site Analysis</h3>
            <p>
              Understand the site conditions, context, and constraints that
              might impact the design.
            </p>
          </div>

          <div className="card">
            <div className="icon">✱</div>
            <h3>Space Planning</h3>
            <p>
              Explore different layouts and spatial configurations to determine
              how the building’s functions will be organized.
            </p>
          </div>

          <div className="card">
            <div className="icon">✱</div>
            <h3>Reshaping Possibilities: From Scan to BIM</h3>
            <p>
              Develop design concepts that align with the project’s goals and
              the clients vision. These concepts might involve architectural
              styles, materials, and overall design philosophies.
            </p>
          </div>

          <div className="card">
            <div className="icon">✱</div>
            <h3>Rough Sketches and Diagrams</h3>
            <p>
              Early visual representations to explore ideas and design
              directions.
            </p>
          </div>

          <div className="card">
            <div className="icon">✱</div>
            <h3>Preliminary Drawings</h3>
            <p>
              Drawings that outline spaces, relationships, and other essential
              features.
            </p>
          </div>

          <div className="card">
            <div className="icon">✱</div>
            <h3>Design Presentations</h3>
            <p>
              Share schematic designs with stakeholders for feedback and
              refinement.
            </p>
          </div>
        </div>

        <div className="card-cta">
          <div className="card-cta-df">
            <span>
              <button>Reduce labor costs by 40%</button>
            </span>
            <span>
              <Image
                src={"./service-img-4.webp"}
                width={0}
                height={0}
                unoptimized
                alt="cta-img"
              ></Image>
            </span>
          </div>
        </div>
      </section>

      <section className="following-steps">
        <h2>Following Steps</h2>
        <p>
          By the end of the Schematic Design phase, the design direction should
          be more clearly defined, and the client should understand how the
          project will take shape. However, the design details are still
          relatively in an early stage, and further refinement and development
          will occur in subsequent phases, such as Design Development and
          Construction Documents.
        </p>
        <span>
          <button>Design Development</button>
          <button>Construction Development</button>
        </span>
      </section>

      <section className="why-work">
        <div className="content">
          <div className="text">
            <h2>Why work with us?</h2>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>Cost Effective</h3>
                <p>
                  Hiring highly-skilled nearshore talent unlocks cost savings of
                  50% compared to US-based professionals
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>Flexible contracts</h3>
                <p>
                  You can choose your type of contract: full, part or flex and
                  switch between these options with no strings attached
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>HR department of your dreams</h3>
                <p>
                  Our pre-screening ensures we present only motivated candidates
                  aligned with your culture and an onboarding process in just 72
                  hours!
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>100% satisfaction guaranteed</h3>
                <p>
                  If you’re not satisfied, we’ll give your money back – no
                  questions asked
                </p>
              </div>
            </div>
          </div>

          <div className="image-wrapper">
            <div className="background">
              <Image
                src={"./service-img-5.webp"}
                width={0}
                height={0}
                unoptimized
                alt="Service-img"
              ></Image>
            </div>
          </div>
        </div>
      </section>

      <div className="card-cta" id="card-cta-two">
        <div className="card-cta-df">
          <span>
            <button>Contact us today!</button>
          </span>
          <span>
            <h1>Hire quality professionals</h1>
          </span>
        </div>
      </div>

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
              {allCards.map((professional, index) => (
                <div key={index} className="professional-card">
                  <div className="card-inner">
                    <div
                      className="card-image"
                      style={{ backgroundColor: professional.bgColor }}
                    >
                      <Image
                        src={professional.image}
                        alt={professional.title}
                        unoptimized
                        width={0}
                        height={0}
                      ></Image>
                    </div>
                    <div className="card-content">
                      <h3
                        className="card-title"
                        style={{
                          color:
                            professional.textColor === "#ffffff"
                              ? "#333333"
                              : professional.textColor,
                        }}
                      >
                        {professional.title}
                      </h3>
                      {professional.subtitle && (
                        <p className="card-subtitle">{professional.subtitle}</p>
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
              className={`indicator ${index === (activeIndex - startIndex + professionals.length) % professionals.length ? "active" : ""}`}
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
