"use client";
import React, { useState, useEffect, useRef } from "react";
import "./services.css";
import Image from "next/image";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);

  const services = [
    {
      title: "Schematic Design (SD)",
      description:
        "Initial phase in the architecture design process, where rough sketches are developed to outline the general layout of the project.",
    },
    {
      title: "CAD Conversions",
      description:
        "Conversion of architectural blueprints to ensure seamless collaboration and efficient project development.",
    },
    {
      title: "Plan Corrections from City Hall",
      description:
        "Official documents required by local authorities to comply with regulations before a construction project can proceed.",
    },
    {
      title: "Detailing for CDs",
      description:
        "Creating detailed drawings and specifications guiding accurate construction, ensuring adherence to design intent.",
    },
    {
      title: "Design Development (DD)",
      description:
        "Sketches from the SD phase incorporate structural considerations to create a cohesive design proposal.",
    },

    {
      title: "Visualization",
      description:
        "The process of creating realistic images to represent architectural designs, allowing clients to visualize the final project before construction begins.",
    },
    {
      title: "Models",
      description:
        "Digital representations of building designs, used for visualizing and communicating concepts and plans.",
    },
    {
      title: "As Built Conversion from Scanning or Measurement",
      description:
        "Description for As Built Conversion from Scanning or Measurement",
    },
  ];

  const professionals = [
    {
      id: 1,
      title: "Landscape Design Services",
      image: "./cad-2.webp",
    },
    {
      id: 2,
      title: "BIM Modeler Services",
      image: "./cad-3.webp",
    },
    {
      id: 3,
      title: "Revit Architecture Services",
      image: "./cad-4.webp",
    },
    {
      id: 4,
      title: "Remote Executive Assistant",
      image: "./cad-5.webp",
    },
  ];

  const allSlides = [...professionals, ...professionals];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + 1;

      // When we reach the duplicate section, seamlessly jump back to the original
      if (nextIndex >= professionals.length) {
        // We don't immediately set to 0, but will do it after transition ends
        return nextIndex;
      }

      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex - 1;

      // When we go below 0, seamlessly jump to the end of original section
      if (nextIndex < 0) {
        // We handle this as a special case in the useEffect
        return nextIndex;
      }

      return nextIndex;
    });
  };

  // Reset slide position after transition when needed
  useEffect(() => {
    if (currentIndex >= professionals.length) {
      // Wait for transition to complete before resetting
      const timer = setTimeout(() => {
        // Disable transition temporarily
        if (slideRef.current) {
          slideRef.current.style.transition = "none";
          setCurrentIndex(currentIndex - professionals.length);

          // Re-enable transition after the reset
          setTimeout(() => {
            if (slideRef.current) {
              slideRef.current.style.transition = "transform 0.5s ease";
            }
          }, 50);
        }
      }, 500); // This should match the CSS transition time
      return () => clearTimeout(timer);
    }

    // Handle wrapping from beginning to end
    if (currentIndex < 0) {
      // Wait for transition to complete before resetting
      const timer = setTimeout(() => {
        // Disable transition temporarily
        if (slideRef.current) {
          slideRef.current.style.transition = "none";
          setCurrentIndex(professionals.length - 1);

          // Re-enable transition after the reset
          setTimeout(() => {
            if (slideRef.current) {
              slideRef.current.style.transition = "transform 0.5s ease";
            }
          }, 50);
        }
      }, 500); // This should match the CSS transition time
      return () => clearTimeout(timer);
    }
  }, [currentIndex, professionals.length]);

  // Auto-play effect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Pause auto-play on hover
  const pauseAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Resume auto-play when not hovering
  const resumeAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  const serviceTwo = [
    { title: "Engineering", color: "#ffbdf4" },
    { title: "Sales & Marketing", color: "#d4b5aa" },
    { title: "Administration & Accounting", color: "#3e0d2a" },
    { title: "Software Development", color: "#58958c" },
  ];

  const reasons = [
    {
      title: "1. Cost Optimization",
      description:
        "Architectural outsourcing services can offer substantial cost savings. Lower labor costs in certain regions and reduced overhead expenses can significantly improve a firm’s bottom line. Imagine the impact of a streamlined payroll, minimized software licensing needs, and optimized resource allocation!",
    },
    {
      title: "2. Efficiency and Focus",
      description:
        "By outsourcing architectural drafting, 3D modeling, or other non-core tasks, firms can free up their in-house architects to focus on core competencies like design innovation and client communication. This translates to improved project efficiency, faster turnaround times, and a more satisfied client base.",
    },
    {
      title: "3. Access to Global Talent",
      description:
        "The talent pool for architects and architectural designers can be limited geographically. Outsourcing architectural design services allows firms to tap into a global network of skilled professionals, often with specialized expertise unavailable locally.",
    },
    {
      title: "4. Scalability",
      description:
        "The architectural industry experiences fluctuating project demands. Architecture outsourcing services offer the flexibility to scale your workforce up or down seamlessly. This eliminates the need for permanent hires during peak periods and avoids underutilized resources during slower times.",
    },
  ];

  const reasonsTwo = [
    {
      title: "Cost Effective",
      description:
        "Hiring highly-skilled nearshore talent unlocks cost savings of 50% compared to US-based professionals.",
    },
    {
      title: "Flexible contracts",
      description:
        "You can choose your type of contract: full, part or flex and switch between these options with no strings attached.",
    },
    {
      title: "HR department of your dreams",
      description:
        "Our pre-screening ensures we present only motivated candidates aligned with your culture and an onboarding process in just 72 hours!",
    },
    {
      title: "100% satisfaction guaranteed",
      description:
        "If you're not satisfied, we’ll give your money back – no questions asked.",
    },
  ];

  const articles = [
    {
      title: "Outsourcing Architectural Services: Complete Guide",
      image: "/service-6.webp",
      alt: "Architectural Design",
    },
    {
      title:
        "Hire cost-effective professional architects without compromising quality results",
      image: "/service-7.webp",
      alt: "Hiring Architects",
    },
    {
      title: "The Cost of Hiring Architects: In-office vs Offshore",
      image: "/service-8.webp",
      alt: "Cost Comparison",
    },
  ];
  return (
    <>
      <Header />
      <section>
        <div className="service-container">
          <div className="banner-text-container">
            <h1 className="banner-title">Architecture Outsourcing Services</h1>
            <button className="button">Hire an architect</button>
            <div className="popular-tags">
              <span className="tag" id="popular">
                Popular:
              </span>
              <span className="tag">Revit Architect</span>
              <span className="tag">BIM Modeler</span>
              <span className="tag">Landscape Designer</span>
            </div>
            <div className="stats">
              <p>
                <svg
                  className="tick"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Trusted by +110 companies in the US
              </p>
              <p>
                <svg
                  className="tick"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                +350 placed professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="service-info">
        <div className="service-info-df">
          <div className="service-left">
            <h1>Transforming Ideas into Visual Concepts</h1>
            <p>
              At WorldTeams, we care about the initial stage of the construction
              process by selecting the best talents who convert ideas into rough
              sketches, diagrams, and basic layouts. The primary goal of the
              Schematic Design phase is to explore and define a project’s
              overall design direction while considering the client’s
              requirements, functional needs, site conditions, and budget
              constraints.
            </p>
          </div>
          <div className="service-right">
            <Image
              src={"/service-img-1.webp"}
              alt="img"
              width={0}
              height={0}
              unoptimized
            ></Image>
          </div>
        </div>
      </section>

      <div className="key-container">
        <h1 className="key-heading">Key activities and outcomes</h1>
        <h2 className="key-subheading">
          of the Schematic Design Architecture phase typically include:
        </h2>

        <div className="key-cards-container">
          <div className="key-card">
            <div className="key-asterisk">*</div>
            <h3 className="key-card-title">Site Analysis</h3>
            <p className="key-card-description">
              Understand the site conditions, context, and constraints that
              might impact the design.
            </p>
          </div>

          <div className="key-card">
            <div className="key-asterisk">*</div>
            <h3 className="key-card-title">Space Planning</h3>
            <p className="key-card-description">
              Explore different layouts and spatial configurations to determine
              how the building's functions will be organized.
            </p>
          </div>

          <div className="key-card">
            <div className="key-asterisk">*</div>
            <h3 className="key-card-title">
              Reshaping Possibilities: From Scan to BIM
            </h3>
            <p className="key-card-description">
              Develop design concepts that align with the project's goals and
              the client's vision. These concepts might involve architectural
              styles, materials, and overall design philosophies.
            </p>
          </div>

          <div className="key-card">
            <div className="key-asterisk">*</div>
            <h3 className="key-card-title">Rough Sketches and Diagrams</h3>
            <p className="key-card-description">
              Create rough hand sketches, diagrams, and basic drawings to
              communicate design ideas.
            </p>
          </div>

          <div className="key-card">
            <div className="key-asterisk">*</div>
            <h3 className="key-card-title">Preliminary Drawings</h3>
            <p className="key-card-description">
              Generate preliminary floor plans, elevations, and sections that
              give a basic understanding of the design.
            </p>
          </div>

          <div className="key-card">
            <div className="key-asterisk">*</div>
            <h3 className="key-card-title">Design Presentations</h3>
            <p className="key-card-description">
              Share the design concepts with the client for feedback and
              refinement.
            </p>
          </div>
        </div>
      </div>

      <section className="sepecialize">
        <div className="sepecialize-df">
          <div className="specialize-left">
            <button>Reduce labor cost by 40%</button>
          </div>
          <div className="specialize-right">
            <Image
              src={"/service-img-4.webp"}
              width={0}
              height={0}
              unoptimized
              alt="img"
            ></Image>
          </div>
        </div>
      </section>

      <section className="why-work">
        <div className="content-two">
          {/* Text Section */}
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

          {/* Image Section */}
          <div className="image-wrapper">
            <div className="background">
              <Image
                src="/abhi.jpg"
                alt="Why Work With Us"
                width="500"
                height="400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* <div className="what-we-offer-container">
        <h2 className="section-title">What we offer</h2>
        <p className="section-subtitle">
          Our top architecture outsourcing services
        </p>
        <div className="service-boxes">
          {serviceTwo.map((service, index) => (
            <div
              key={index} 
              className="service-box"
              id={`service-box-${index + 1}`} 
              style={{ backgroundColor: service.color }} 
            >
              <div className="service-box-inner">
                <h3 className="service-title">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="offer-cta">
          <button>Hire an architect</button>
        </div>
      </div> */}

      {/* <div className="outsourcing-container">
        <h2 className="section-title">Why Choose Architecture Outsourcing?</h2>
        <div className="outsourcing-boxes">
          {reasons.map((reason, index) => (
            <div className={`outsourcing-box box-${index + 1}`} key={index}>
              <h3 className="outsourcing-title">{reason.title}</h3>
              <p className="outsourcing-description">{reason.description}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* <div className="outsourcing-container-two">
        <div className="text-container">
          <p className="intro-text">
            There are many reasons why{" "}
            <span className="highlight">
              outsourcing architectural services is key
            </span>
            . But, all in all, it’s because you want to do more while keeping
            your costs down without sacrificing even the slightest bit of
            quality. Or, in fewer words, you want to save money while obtaining
            superior quality.
          </p>
          <p className="intro-text">
            However, we understand that you may have reservations about
            outsourcing, and we get it; plenty of professionals worldwide make
            promises they can’t keep. But, at WorldTeams,{" "}
            <span className="highlight">
              we can connect you with the top 3%
            </span>{" "}
            of Latin American professionals that possess:
          </p>
          <ul className="feature-list">
            <li>
              Skills accredited by a wide range of experience with US companies.
            </li>
            <li>Degrees from major worldwide universities.</li>
            <li>Near-native English skills.</li>
            <li>Knowledge of US and international architecture standards.</li>
            <li>A portfolio of high-quality, diverse work.</li>
          </ul>
          <p className="closing-text">
            All of these, coupled with the fact that their rates tend to be
            one-third of what you’re used to paying, outsourcing quickly becomes
            pocket-friendly and smarter overall. What you want is to be able to
            scale your company, take on more projects, and still be able to
            maintain the reputation that your clients trust you for.
          </p>
        </div>
        <div className="image-container-one">
          <Image
            src={"/service-4.webp"}
            alt="People working together"
            className="outsourcing-image-one"
            width={0}
            height={0}
            unoptimized
          ></Image>
        </div>
      </div> */}

      <div className="cta-container-df">
        <div className="cta-container">
          <div className="cta-text">
            <h2>At WorldTeams</h2>
          </div>
          <button className="cta-button">Need Help</button>
        </div>
      </div>

      <div className="professionals-section">
        <h1 className="professionals-heading">
          Explore other Most Wanted Professionals
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
            {allSlides.map((professional, index) => (
              <div
                key={`${professional.id}-${index}`}
                className="carousel-slide"
              >
                <div className="professional-card">
                  <div className="image-container">
                    <img src={professional.image} alt={professional.title} />
                  </div>
                  <h3>{professional.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="most-wanter">
        <h1>Most Wanted Architecture Professionals</h1>
        <div className="wanted-box-df">
          <div className="wanted-box">
            <h3>Senior Revit Architect</h3>
          </div>
          <div className="wanted-box">
            <h3>Senior Revit Architect</h3>
          </div>
          <div className="wanted-box">
            <h3>Senior Revit Architect</h3>
          </div>
          <div className="wanted-box">
            <h3>Senior Revit Architect</h3>
          </div>
          <div className="wanted-box">
            <h3>Senior Revit Architect</h3>
          </div>
        </div>
      </div> */}
      {/* 
      <div className="why-work-container">
        <div className="text-container">
          <h2 className="title">Why work with us?</h2>
          {reasonsTwo.map((reason, index) => (
            <div className="reason-container" key={index}>
              <div className="reason">
                <div className="checkmark">✔</div>
                <div className="reason-text">
                  <h3 className="reason-title">{reason.title}</h3>
                  <p className="reason-description">{reason.description}</p>
                </div>
              </div>
              <hr className="reason-divider" />
            </div>
          ))}
        </div>
        <div className="image-container-two">
          <Image
            src={"/service-5.webp"}
            alt="People working together"
            className="outsourcing-image-two"
            width={0}
            height={0}
            unoptimized
          ></Image>
        </div>
      </div> */}
      {/* 
      <div className="cta-container-df" id="cta-small-parent">
        <div className="cta-container" id="cta-small">
          <div className="cta-text">
            <p>Need a hand?</p>
          </div>
          <button className="cta-button">Hire an Architect Now</button>
        </div>
      </div> */}

      {/* <div className="stay-updated">
        <h2 className="section-title">Stay Updated</h2>
        <div className="cards-container">
          {articles.map((article, index) => (
            <div className={`card card-${index + 1}`} key={index}>
              <Image
                src={article.image}
                alt={article.alt}
                className="card-image"
                unoptimized
                width={0}
                height={0}
              ></Image>
              <div className="card-text">
                <h3 className="card-title">{article.title}</h3>
                <p className="card-description">{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* <div className="other-services-container">
        <h2 className="other-title">Our Other Services</h2>
        <div className="services-container">
          {serviceTwo.map((service, index) => (
            <div
              className="service-box-two"
              key={index}
              id={`other${index + 1}`}
              style={{ backgroundColor: service.color }}
            >
              <span className="service-title">{service.title}</span>
            </div>
          ))}
        </div>
      </div> */}

      <Footer />
    </>
  );
};

export default Services;
