"use client";
import Image from "next/image";
import styles from "./page.css";
import Header from "./Components/Header/page";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { gsap, CSSPlugin, Expo } from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/pagination";
import { FaTrophy, FaUsers, FaStar, FaChartLine } from "react-icons/fa";
import Footer from "./Components/Footer/page";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { getFileAsset } from "@sanity/asset-utils";

gsap.registerPlugin(CSSPlugin);

const steps = [
  {
    id: "01",
    title: "Meet Customers",
    description:
      "We introduce and present ourselves. Our priority is to listen and understand the client’s vision for clearer insight about the project.",
  },
  {
    id: "02",
    title: "Planning & Research",
    description:
      "With the help of research and critical analysis, we prepare the first set of the drawings taking into account the requirements of the clients.",
  },
  {
    id: "03",
    title: "Finalize the Design",
    description:
      "The feedback of the client is solicited and integrated. The changes are incorporated and the final set of completed drawings are prepared.",
  },
];
const images = ["/process-img.jpg", "/process-img2.jpg", "/process-img3.jpg"];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSrc, setImageSrc] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [logo, setLogo] = useState("/red-logo.png");
  const textRef = useRef(null);
  const textRefs = useRef([]);
  const [open, setOpen] = useState(null);
  const [testSliderContent, setTextSliderContent] = useState(false);
  const [videos, setVideos] = useState({
    peopleVideo: null,
    serviceVideo: null,
  });
  const [bgImage, setBgImage] = useState("");

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        instanceRef.current = slider;
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );
  const revealAnimation = () => {
    const t1 = gsap.timeline({
      onComplete: () => setLoading(false), // Instantly remove loader
    });

    t1.to(".count", { opacity: 0, duration: 0.1 })
      .to(".progress-bar-two", { opacity: 0, duration: 0.1 })
      .to(".follow-top", { height: "50vh", ease: "expo.inOut", duration: 0.4 })
      .to(
        ".follow-bottom",
        { height: "50vh", ease: "expo.inOut", duration: 0.4 },
        "-=0.4"
      )
      .fromTo(
        ".logo",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, ease: "expo.inOut", duration: 0.4 }
      )
      .to(".logo", {
        opacity: 0,
        scale: 0.8,
        ease: "expo.inOut",
        duration: 0.3,
        delay: 0.2,
      })
      .to(".follow-top", { height: "0%", duration: 0.3, ease: "expo.inOut" })
      .to(
        ".follow-bottom",
        { height: "0%", duration: 0.3, ease: "expo.inOut" },
        "-=0.3"
      )
      .to(".loader-container", {
        opacity: 0,
        duration: 0.2,
        ease: "expo.inOut",
      })
      .set(".loader-container", { display: "none" }); // Instantly hide
  };

  const [artistData, setArtistData] = useState(null);
  const [homepageData, setHomepageData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistData = await client.fetch('*[_type == "artist"]');
        const homepageData = await client.fetch('*[_type == "homepage"]');

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
        setVideos({
          peopleVideo: resolveVideo(homepageData[0]?.peopleVideo?.asset?._ref),
          serviceVideo: resolveVideo(
            homepageData[0]?.serviceCirclVideo?.asset?._ref
          ),
        });

        console.log(artistData);
        console.log(homepageData);

        // Set the fetched data into the state
        setArtistData(artistData);
        setHomepageData(homepageData);
      } catch (error) {
        console.error("Error fetching data from Sanity:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (homepageData?.[0]) {
      const lightImg = urlFor(homepageData[0].lightModeImage).url();
      const darkImg = urlFor(homepageData[0].darkModeImage).url();

      const updateImage = () => {
        const isDark = document.body.classList.contains("dark-mode");
        setBgImage(isDark ? darkImg : lightImg);
      };

      updateImage();

      const observer = new MutationObserver(updateImage);
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }
  }, [homepageData]);

  // Working Process Images Changer
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % images.length;
        setImageSrc(images[newIndex]);
        setActiveIndex(newIndex); // ✅ Correctly update activeIndex
        return newIndex;
      });
    }, 4000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  const handleImageChange = (newIndex) => {
    setImageSrc(images[newIndex]);
    setActiveIndex(newIndex);
    setIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev < 100 ? prev + 5 : 100));
    }, 14);

    if (counter === 100) {
      clearInterval(interval);
      revealAnimation();
    }

    return () => clearInterval(interval);
  }, [counter]);

  // useEffect(() => {
  //   const interval = setInterval(nextSlide, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   const slider = document.querySelector(".testimonial-slider");
  //   if (slider) {
  //     slider.style.transition = "all 0.5s ease";
  //   }
  // }, [current]);

  // const handleClick = () => {
  //   setActive(!active);
  // };

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  const icons = [
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % icons.length); // Loop back to the first icon when it reaches the last
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [icons.length]);

  useEffect(() => {
    textRefs.current.forEach((el, index) => {
      if (el) {
        const splitText = new SplitType(el, { type: "chars" });

        gsap.from(splitText.chars, {
          opacity: 0,
          yPercent: 100,
          duration: 0.2,
          ease: "power2.out",
          stagger: 0.05, // Adds a delay between each character
          scrollTrigger: {
            trigger: el,
            start: "top 80%", // Adjust for when it should start
            toggleActions: "play none none none",
          },
        });
      }
    });
  }, []);

  // useEffect(() => {
  //   const updateLogo = () => {
  //     setLogo(
  //       document.body.classList.contains("dark-mode")
  //         ? "/white-logo.png"
  //         : "/red-logo.png"
  //     );
  //   };

  //   // Run on mount
  //   updateLogo();

  //   // Observe for changes
  //   const observer = new MutationObserver(() => {
  //     updateLogo();
  //   });

  //   observer.observe(document.body, { attributes: true });

  //   return () => observer.disconnect(); // Cleanup observer
  // }, []);

  useEffect(() => {
    gsap.to(textRef.current, {
      rotation: 360,
      transformOrigin: "center",
      repeat: -1,
      duration: 8,
      ease: "linear",
    });
  }, []);

  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <div className="loading">
            <p className="count">{counter}%</p>
            <div
              className="progress-bar-two"
              style={{ width: `${counter}%` }}
            ></div>
          </div>
          <div className="follow-container">
            <div className="follow follow-top"></div>
            <div className="follow follow-bottom"></div>
          </div>
          <div className="logo-container">
            <Image
              className="logo"
              src="/white-logo.png"
              alt="logo"
              width={200}
              height={200}
              unoptimized
            />
          </div>
        </div>
      ) : (
        <div className="nav">
          <div className="intro-container">
            <Header />
            <div
              className="hero-banner"
              style={{
                backgroundImage: `url(${bgImage})`,
              }}
            >
              <div className="overlay"></div>
            </div>

            <div className="about-us">
              <h2>{homepageData[0].allowLightHeading}</h2>
              <div className="about-us-top">
                <div className="about-us-top-left">
                  <h1>{homepageData[0].allowUsHeading}</h1>
                </div>
                <div className="about-us-top-right">
                  <h1>{homepageData[0].allowRightHeading}</h1>

                  <PortableText value={homepageData[0].paragraph} />
                  <span>
                    <div className="key-benefit">
                      <span>
                        <ul className="list-disc pl-6 space-y-2">
                          {homepageData[0].bulletPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div className="about-us-video-image">
              <div className="about-us-img">
                {homepageData?.[0]?.peoplImageOne?.asset && (
                  <Image
                    src={urlFor(homepageData[0].peoplImageOne).url()}
                    width={500}
                    height={500}
                    alt="People image"
                    unoptimized
                  />
                )}
                {videos.peopleVideo && (
                  <video
                    src={videos.peopleVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                    style={{ width: "100%", height: "auto" }}
                  />
                )}

                {homepageData?.[0]?.peoplImageTwo?.asset && (
                  <Image
                    src={urlFor(homepageData[0].peoplImageTwo).url()}
                    width={500}
                    height={500}
                    alt="People image"
                    unoptimized
                  />
                )}
              </div>
              <div className="about-us-video-text">
                <h1>{homepageData[0].peopleText}</h1>
              </div>
              <div className="who-we-are-btn">
                <Link href="#">
                  <button>
                    <span>{homepageData[0].ctaButton}</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="strip-text">
              <div className="marquee">
                <p>{homepageData[0].sliderTextOne}</p>
                <p>{homepageData[0].sliderTextTwo}</p>
              </div>
            </div>

            <div className="service-two">
              <div className="service-two-top">
                <div className="service-two-top-left">
                  <h5>{homepageData[0].serviceSmallHeading}</h5>
                  <h1>{homepageData[0].serviceBigHeading}</h1>
                </div>
              </div>
              <div className="service-two-bottom">
                <div className="service-two-bottom-left">
                  {homepageData[0]?.services?.map((service, index) => (
                    <div
                      key={service._id || index} // Use _id for a unique key if available, else fallback to index
                      className="service-two-bottom-box"
                      id={`service-two-box-${service._id || index}`}
                    >
                      <div className="service-two-bottom-box-top">
                        <span className="service-two-bottom-box-logo">
                          <Image
                            src={urlFor(service.serviceImage).url()}
                            width={60}
                            height={60}
                            unoptimized
                            alt={service.serviceTitle || "Service Icon"} // Fallback alt text if serviceTitle is missing
                          />
                        </span>
                        <h3>
                          {service.serviceTitle || "No title available"}
                        </h3>{" "}
                      </div>
                      <div className="service-two-bottom-box-bottom">
                        <p>
                          {service.serviceContent || "No description available"}
                        </p>{" "}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="service-two-bottom-right">
                  {videos.serviceVideo && (
                    <video
                      src={videos.serviceVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls={false}
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </div>
                <div className="services-one_circle-color"></div>
              </div>
            </div>

            <div className="feature-section">
              <div className="feature-section-df">
                <div className="feature-box">
                  <h1>{homepageData[0].trustIconsHeading}</h1>
                  <div className="features-name">
                    {homepageData[0]?.serviceRelatedIcon?.map(
                      (related, index) => {
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
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="achievements-container">
                <div className="achievements-grid">
                  {homepageData[0]?.clientReviews?.map((review, index) => {
                    return (
                      <div
                        key={index}
                        className={`achievement-card ${review.gradient}`}
                      >
                        <div className="achievement-content">
                          <div className="achievement-text">
                            <span>
                              <h3>{review.clientReviewTitle}</h3>
                            </span>
                            <span className="achievement-numbers">
                              <p>{review.clientReviewNumber}</p>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <section className="rto-section">
              <div className="background-process-img"></div>
              <h2 className="heading">
                {homepageData[0].workingProcessHeading}
              </h2>
              <p className="subheading">
                {homepageData[0].workingProcessSubHeading}
              </p>

              <div className="content">
                <div className="left">
                  {homepageData[0]?.processSteps
                    ?.filter((step) => step.stepTitle && step.stepText) // Filter out empty or incomplete steps
                    .map((step, idx) => (
                      <div
                        key={idx}
                        className={`card ${idx === activeIndex ? "active" : ""}`}
                        onClick={() => handleImageChange(idx)} // Update activeIndex
                      >
                        <div className="number">{idx + 1}</div>
                        <div>
                          <h3 className="card-title">{step.stepTitle}</h3>
                          <p className="card-text">{step.stepText}</p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="right">
                  {homepageData[0]?.processSteps?.[activeIndex]?.stepImage && (
                    <Image
                      src={urlFor(
                        homepageData[0]?.processSteps[activeIndex]?.stepImage
                      ).url()}
                      alt={
                        homepageData[0]?.processSteps[activeIndex]?.stepTitle ||
                        "Step Image"
                      }
                      width={500}
                      height={500}
                      unoptimized
                    />
                  )}
                </div>
              </div>
            </section>

            <div className="technology-we-use">
              <h1>Technologies We Used</h1>
              <div className="technology-grid">
                {homepageData[0]?.technologyImgs?.length > 0 ? (
                  homepageData[0].technologyImgs.map((img, index) => {
                    return (
                      <span key={index}>
                        <Image
                          src={urlFor(img.technologyImage).url()} // Fetch image URL from Sanity
                          width={500} // Set your preferred width for the image
                          height={500} // Set your preferred height for the image
                          alt="img" // Alt text for the image
                          unoptimized
                        />
                      </span>
                    );
                  })
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>

            <div className="faqs">
              <div className="faq-accordion">
                <h2>{homepageData[0]?.faqHeading}</h2>
                {homepageData[0]?.faq?.map((faq, index) => (
                  <div
                    key={index}
                    className={`faq-item ${open === index ? "active" : ""}`}
                  >
                    <div className="faq-question" onClick={() => toggle(index)}>
                      {faq.question}
                      <span className="icon">{open === index ? "-" : "+"}</span>
                    </div>
                    <div
                      className={`faq-answer ${open === index ? "open" : ""}`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
              <div className="faq-sketch"></div>
            </div>

            <div className="reviews-section">
              <div className="navigation-wrapper">
                <button
                  className="prev-button"
                  onClick={() => instanceRef.current?.prev()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    />
                  </svg>
                </button>
                <div ref={sliderRef} className="keen-slider">
                  {homepageData[0]?.founderSlider?.map((founder, idx) => (
                    <div
                      key={idx}
                      className={`keen-slider__slide number-slide${idx + 1}`}
                    >
                      <div className="testimonial-container">
                        <div className="testimonial-box">
                          <h2>{founder.founderTitle}</h2>

                          <PortableText value={founder.founderDescription} />

                          <div className="author">
                            {founder.founderThumbnailImage?.asset?._ref && (
                              <Image
                                src={urlFor(
                                  founder.founderThumbnailImage
                                ).url()}
                                alt="Founder Team"
                                width={400}
                                height={400}
                                className="profile-img"
                                unoptimized
                              />
                            )}
                            <div>
                              <h4 className="name">{founder.founderName}</h4>
                              <p className="designation">{founder.position}</p>
                            </div>
                          </div>
                        </div>

                        <div className="testimonial-image">
                          {founder.founderImage?.asset?._ref && (
                            <Image
                              src={urlFor(founder.founderImage).url()}
                              alt="Founder Team"
                              width={400}
                              height={400}
                              className="team-img"
                              unoptimized
                            />
                          )}

                          <div className="white-box"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="next-button"
                  onClick={() => instanceRef.current?.next()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <section className="contact-us">
              <div className="contact-container">
                <div className="contact-us-df">
                  <div className="contact-left">
                    {homepageData[0]?.contactUsSectionImg?.asset && (
                      <Image
                        src={urlFor(homepageData[0].contactUsSectionImg).url()}
                        width={500}
                        height={500}
                        alt="footer-img"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="contact-right">
                    <h1>{homepageData[0]?.contactUsTitle}</h1>

                    <div className="contact-form">
                      <div className="form-fields">
                        <label htmlFor="fname">Name</label>
                        <input
                          type="text"
                          name="firstName"
                          id="fname"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="form-fields">
                        <label htmlFor="email">Email</label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Email"
                        />
                      </div>
                      <div className="form-fields">
                        <label htmlFor="phone">Phone no</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          placeholder="Phone no"
                        />
                      </div>
                      <div className="form-fields">
                        <label htmlFor="service">Services</label>
                        <input
                          type="text"
                          name="service"
                          id="service"
                          placeholder="Service"
                        />
                      </div>
                    </div>
                    <div className="contact-btn">
                      <span>
                        <button>{homepageData[0]?.contactUsButton}</button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Footer />
          </div>

          <div className="whatsapp">
            <a
              target="_blank"
              href="https://wa.me/919910085603/?text=I%20would%20like%20to%20know%20about%20ADPL%20Consulting%20LLC%20!"
            >
              <Image
                src={"/whatsapp.png"}
                width={60}
                height={60}
                alt="Whatsapp-img"
                unoptimized
              ></Image>
            </a>
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
      )}
    </>
  );
}
