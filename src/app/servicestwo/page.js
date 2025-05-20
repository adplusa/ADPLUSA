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

  const servicesData = [
    {
      title: "Remote Executive Assistant",
      category: "Services",
      image: "/cad-1.webp",
    },
    {
      title: "MEP Engineer",
      category: "Services",
      image: "/cad-2.webp",
    },
    {
      title: "Construction Documentation",
      category: "Services",
      image: "/cad-4.webp",
    },
    {
      title: "CAD Outsourcing",
      category: "Services",
      image: "/cad-3.webp",
    },

    {
      title: "Bim Services",
      category: "Services",
      image: "/cad-2.webp",
    },

    {
      title: "MEP Engineer",
      category: "Services",
      image: "/cad-3.webp",
    },

    {
      title: "Presenting Drawing",
      category: "Services",
      image: "/cad-4.webp",
    },

    {
      title: "3D Visualization",
      category: "Services",
      image: "/cad-5.webp",
    },
  ];

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
          <h1>{data?.trustSection?.title}</h1>
          <p>{data?.trustSection?.subtitle}</p>
        </div>
      </section>

      <div className="feature-section">
        <div className="feature-section-df">
          <div className="feature-box">
            <h1>{data.serviceRelatedHeading}</h1>
            <h1>{data?.trustIconsHeading}</h1>
            <div className="features-name">
              {data?.serviceRelatedIcon?.map((related, index) => {
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
                    <p>{related.serviceRelatedNumber}</p>
                    <h3>{related.serviceRelatedName}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="home_services">
        <h1>{data.serviceHeading}</h1>
        <div className="home_services_box">
          {data.serviceBox?.map((service, index) => (
            <Link href="/services" key={index}>
              <div className="service-box-home" key={index}>
                <div className="service-image">
                  <Image
                    src={urlFor(service.serviceBoxImg).url()}
                    alt={service.serviceBoxTitle}
                    width={400}
                    height={200}
                    unoptimized
                  ></Image>
                </div>
                <h2>{service.serviceBoxTitle}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Work With Us */}
      <section className="why-work">
        <div className="content-two">
          <div className="text">
            <h2>{data?.whyWorkWithUs?.title}</h2>

            {data?.whyWorkWithUs?.features?.map((feature, idx) => (
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
              {data?.whyWorkWithUs?.image && (
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
    </>
  );
};

export default ServiceTwo;
