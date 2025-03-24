"use client";
import Image from "next/image";
import styles from "./page.css";
import Header from "./Components/Header/page";
import { CountUp } from "countup.js";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { gsap, CSSPlugin, Expo } from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/pagination";
import { FaQuoteLeft } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaTrophy, FaUsers, FaStar, FaChartLine } from "react-icons/fa";
import Footer from "./Components/Footer/page";
import DOMPurify from "dompurify";

gsap.registerPlugin(CSSPlugin);

const faqs = [
  {
    question: "How do we start a project?",
    answer:
      "Here’s how to begin a project: First, you’ll need to decide on the scope of work, the desired timelines, and the resources you need. Then, you can contact us with your details.",
  },
  {
    question: "What file types do you accept?",
    answer:
      "We accept a variety of file formats such as .pdf, .jpg, .png, .docx, .xlsx, and more. If you have a specific type, feel free to reach out.",
  },
  {
    question: "Are revisions included in the price?",
    answer:
      "Yes, we include revisions as part of the initial price. The number of revisions depends on the project type.",
  },
  {
    question: "Is my project information safe?",
    answer:
      "Absolutely. We use secure platforms and maintain a strict confidentiality agreement to ensure your project details are safe with us.",
  },
  {
    question: "How will we communicate?",
    answer:
      "Communication will take place via email, calls, or video meetings, depending on the project needs and your preferences.",
  },
  {
    question: "How can I pay?",
    answer:
      "You can pay through various methods, including bank transfers, credit/debit cards, or digital payment services like PayPal.",
  },
];

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

const achievements = [
  {
    icon: FaTrophy,
    title: "Years of Experience",
    numbers: "3+",
    gradient: "blue-gradient",
  },
  {
    icon: FaUsers,
    title: "Clients Served",
    numbers: "100",
    gradient: "teal-gradient",
  },
  {
    icon: FaStar,
    title: "Reviews",
    numbers: "5",
    gradient: "orange-gradient",
  },
  {
    icon: FaChartLine,
    title: "Projects Completed",
    numbers: "150",
    gradient: "purple-gradient",
  },
];

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "https://architect-3cto.onrender.com";

console.log("ENV:", process.env.NODE_ENV);
console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

// const response = await fetch(`${API_BASE_URL}/api/text-slider?populate=*`);

// const heroData = await fetch(`${API_BASE_URL}/api/homepage?populate=*`);
// const heroData = await fetch("http://localhost:1337/api/homepage?populate=*");

// const heroResponse = await heroData.json();

// const aboutData = await fetch(
//   "http://localhost:1337/api/homepage-about-us-section?populate=*"
// );
// const aboutResponse = await aboutData.json();

// const SpecializerData = await fetch(
//   "http://localhost:1337/api/specialize-section?populate=*"
// );
// const specializerResponse = await SpecializerData.json();

// const ServiceData = await fetch(
//   "http://localhost:1337/api/service-sections?populate=*"
// );
// const ServiceResponse = await ServiceData.json();
// const services = ServiceResponse.data[0]?.Services || [];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // const [textOne, setTextOne] = useState("");
  // const [textTwo, setTextTwo] = useState("");

  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  // const [index, setIndex] = useState(0);
  // const [activeStep, setActiveStep] = useState(steps[0].id);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [currentSlide, setCurrentSlide] = useState(0);
  // const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [index, setIndex] = useState(0);
  // const [current, setCurrent] = useState(0);
  const [logo, setLogo] = useState("/red-logo.png");
  const textRef = useRef(null);

  const textRefs = useRef([]);
  const [open, setOpen] = useState(null);
  const [testSliderContent, setTextSliderContent] = useState(false);

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

  // Text Slider Useeffect
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/text-slider?populate=*`
  //       );
  //       const data = await response.json(); // Parse as JSON
  //       console.log("API Response:", response); // Debugging log

  //       if (data?.data) {
  //         const rawTextOne = data.data.Text_one || "";
  //         const rawTextTwo = data.data.Text_two || "";

  //         setTextOne(DOMPurify.sanitize(rawTextOne));
  //         setTextTwo(DOMPurify.sanitize(rawTextTwo));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching or parsing text slider data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
  useEffect(() => {
    (async () => {
      const TextSliderData = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/text-slider?populate=*`
      );
      const data = await TextSliderData.json();
      setTextSliderContent(data);
    })();
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
            {/* <div
              className="hero-banner"
              style={{
                "--light-bg-image": `url(${API_BASE_URL}${heroResponse.data.heroBannerLight[0].url})`,
                "--dark-bg-image": `url(${API_BASE_URL}${heroResponse.data.heroBannerDark[0].url})`,
              }}
            >
              <div className="overlay"></div>
            </div> */}

            {/* <div className="about-us">
              <h2>{aboutResponse.data.about_us_left_who_we_are}</h2>

              <div className="about-us-top">
                <div className="about-us-top-left">
                  <h1>{aboutResponse.data.about_us_left_heading}</h1>
                </div>
                <div className="about-us-top-right">
                  <h1>{aboutResponse.data.about_us_right_title}</h1>

                  <p>{aboutResponse.data.about_us_right_paragraph}</p>
                  <span>
                    <div className="key-benefit">
                      <span>
                        <ul>
                          {aboutResponse.data.about_us_right_bullet_points.map(
                            (point, index) => (
                              <li key={index}>{point}</li>
                            )
                          )}
                        </ul>
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            </div> */}

            {/* <div className="about-us-video-image">
              <div className="about-us-img">
                <Image
                  id="pawel"
                  src={`http://localhost:1337${aboutResponse.data.about_us_section_down_img_one[0].url}`}
                  alt="about-us img"
                  width={0}
                  height={0}
                  unoptimized
                ></Image>

                <video muted autoPlay loop>
                  <source
                    src={`http://localhost:1337${aboutResponse.data.about_us_section_down_img_two[0].url}`}
                    type="video/mp4"
                  />
                </video>

                <Image
                  id="vladimir"
                  src={`http://localhost:1337${aboutResponse.data.about_us_section_down_img_three[0].url}`}
                  alt="about-us image"
                  width={0}
                  height={0}
                  unoptimized
                ></Image>
              </div>
              <div className="about-us-video-text">
                <h1>Adplusa</h1>
              </div>
              <div className="who-we-are-btn">
                <Link href="#">
                  <button>
                    <span>
                      {aboutResponse.data.about_us_section_button_cta}
                    </span>
                  </button>
                </Link>
              </div>
            </div> */}

            <div className="strip-text">
              <div className="marquee">
                {/* <p dangerouslySetInnerHTML={{ __html: textOne }} />
                <p dangerouslySetInnerHTML={{ __html: textTwo }} /> */}
                <p>{testSliderContent.data.Text_one}</p>
                <p>{testSliderContent.data.Text_two}</p>
              </div>
            </div>

            {/* <div className="service-two">
              <div className="service-two-top">
                <div className="service-two-top-left">
                  <h5>{specializerResponse.data.heading}</h5>
                  <h1>{specializerResponse.data.subheading}</h1>
                </div>
              </div>
              <div className="service-two-bottom">
                <div className="service-two-bottom-left">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="service-two-bottom-box"
                      id={`service-two-box-${service.id}`}
                    >
                      <div className="service-two-bottom-box-top">
                        <span className="service-two-bottom-box-logo">
                          <Image
                            src={
                              service.icon?.url
                                ? `http://localhost:1337${service.icon.url}`
                                : "/default-icon.png"
                            }
                            width={60}
                            height={60}
                            unoptimized
                            alt={service.service_name}
                          />
                        </span>
                        <h3>{service.service_name}</h3>
                      </div>
                      <div className="service-two-bottom-box-bottom">
                        <p>
                          {service.service_description[0]?.children[0]?.text ||
                            "No description available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="service-two-bottom-right">
                  <video muted autoPlay loop>
                    <source
                      src={`http://localhost:1337${specializerResponse.data.service_right_big_img?.url}`}
                      type="video/mp4"
                    />
                  </video>
                </div>
                <div className="services-one_circle-color"></div>
              </div>
            </div> */}

            <div className="feature-section">
              <div className="feature-section-df">
                <div className="feature-box">
                  <h1>We specialize in outsourcing architectural services</h1>
                  <div className="features-name">
                    <span>
                      <Image
                        src={"1.png"}
                        alt="icon-img"
                        width={70}
                        height={70}
                        unoptimized
                        priority
                      ></Image>
                      <p>100%</p>
                      <h3>Maintenance Support</h3>
                    </span>
                    <span>
                      <Image
                        src={"2.png"}
                        alt="icon-img"
                        width={70}
                        height={70}
                        unoptimized
                        priority
                      ></Image>
                      <p>75+</p>
                      <h3>Cost-Effective</h3>
                    </span>
                    <span>
                      <Image
                        src={"6.png"}
                        alt="icon-img"
                        width={70}
                        height={70}
                        unoptimized
                        priority
                      ></Image>
                      <p>135+</p>
                      <h3>Swift Deliverance</h3>
                    </span>

                    <span>
                      <Image
                        src={"5.png"}
                        alt="icon-img"
                        width={70}
                        height={70}
                        unoptimized
                        priority
                      ></Image>
                      <p>90+</p>
                      <h3> Newest Technology</h3>
                    </span>
                  </div>
                </div>
              </div>

              <div className="achievements-container">
                <div className="achievements-grid">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`achievement-card ${achievement.gradient}`}
                    >
                      <div className="achievement-content">
                        <div className="achievement-text">
                          <span>
                            <h3>{achievement.title}</h3>
                          </span>
                          <span className="achievement-numbers">
                            <p>{achievement.numbers}</p>
                            <achievement.icon className="achievement-icon" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="rto-section">
              <div className="background-process-img"></div>
              <h2 className="heading">
                Our <span className="asked">Working</span> Process
              </h2>
              <p className="subheading">
                From concept to completion, we transform ideas into functional
                and
                <br /> aesthetic architectural designs
              </p>

              <div className="content">
                <div className="left">
                  {[
                    {
                      title: "Meet Customers",
                      text: "We introduce and present ourselves. Our priority is to listen and understand the client’s vision for clearer insight about the project.",
                    },
                    {
                      title: "Planning & Research",
                      text: "With the help of research and critical analysis, we prepare the first set of the drawings taking into account the requirements of the clients.",
                    },
                    {
                      title: "Finalize the Design",
                      text: "The feedback of the client is solicited and integrated. The changes are incorporated and the final set of completed drawings are prepared.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`card ${idx === activeIndex ? "active" : ""}`}
                      onClick={() => handleImageChange(idx)}
                    >
                      <div className="number">{idx + 1}</div>
                      <div>
                        <h3 className="card-title">{item.title}</h3>
                        <p className="card-text">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="right">
                  <Image
                    src={imageSrc}
                    alt="Process Image"
                    width={0}
                    height={0}
                    unoptimized
                  />
                </div>
              </div>
            </section>

            <div className="technology-we-use">
              <h1>Technologies we use</h1>
              <div className="technology-grid">
                <span>
                  <Image
                    src="/revit.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/revit.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/revit.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/sketchup_logo.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/sketchup_logo.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/sketchup_logo.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/archicad_logo (1).webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>

                <span>
                  <Image
                    src="/archicad_logo (1).webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>

                <span>
                  <Image
                    src="/archicad_logo (1).webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>

                <span>
                  <Image
                    src="/archicad_logo.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/archicad_logo.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
                <span>
                  <Image
                    src="/archicad_logo.webp"
                    width={0}
                    height={0}
                    alt="footer-img"
                    unoptimized
                  ></Image>
                </span>
              </div>
            </div>

            <div className="faqs">
              <div className="faq-accordion">
                <h2>
                  Frequently <span className="asked">asked</span> questions
                </h2>
                {faqs.map((faq, index) => (
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
                  <div className="keen-slider__slide number-slide1">
                    <div className="testimonial-container">
                      <div className="testimonial-box">
                        <h2>Our Founder & Principal Architect</h2>
                        <p>
                          “An Indian, living in the capital city of India;
                          Delhi, is an award-winning architect, who incorporated
                          a company with a clear intent to foster an egalitarian
                          organizational ethos where distinctive architectural
                          talent finds self-expression and can contribute in a
                          democratic and collaborative work environment.”
                        </p>
                        <p>
                          Focused on core competencies in the field of
                          Architecture, Interior Designing, Consulting
                          Engineering, and other Allied Services and having an
                          experience of 22+ Yrs.
                        </p>
                        <div className="author">
                          <Image
                            src="/founder.jpg"
                            alt="Sylwia Gieruszyńska"
                            width={50}
                            height={50}
                            className="profile-img"
                          />
                          <div>
                            <h4 className="name">Abhishek Aggarwal</h4>
                            <p className="designation">Founder</p>
                          </div>
                        </div>
                      </div>
                      <div className="testimonial-image">
                        <Image
                          src="/founder.jpg"
                          alt="Team"
                          width={400}
                          height={400}
                          className="team-img"
                        />
                        <div className="white-box"></div>
                      </div>
                    </div>
                  </div>
                  <div className="keen-slider__slide number-slide2">
                    <div className="testimonial-container">
                      <div className="testimonial-box">
                        <h2>Our Founder & Principal Architect</h2>
                        <p>
                          “An Indian, living in the capital city of India;
                          Delhi, is an award-winning architect, who incorporated
                          a company with a clear intent to foster an egalitarian
                          organizational ethos where distinctive architectural
                          talent finds self-expression and can contribute in a
                          democratic and collaborative work environment.”
                        </p>
                        <p>
                          Focused on core competencies in the field of
                          Architecture, Interior Designing, Consulting
                          Engineering, and other Allied Services and having an
                          experience of 22+ Yrs.
                        </p>
                        <div className="author">
                          <Image
                            src="/founder.jpg"
                            alt="Sylwia Gieruszyńska"
                            width={50}
                            height={50}
                            className="profile-img"
                          />
                          <div>
                            <h4 className="name">Abhishek Aggarwal</h4>
                            <p className="designation">Founder</p>
                          </div>
                        </div>
                      </div>
                      <div className="testimonial-image">
                        <Image
                          src="/founder.jpg"
                          alt="Team"
                          width={400}
                          height={400}
                          className="team-img"
                        />
                        <div className="white-box"></div>
                      </div>
                    </div>
                  </div>
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
                    <Image
                      src="/contact-img.webp"
                      width={0}
                      height={0}
                      alt="footer-img"
                      unoptimized
                    ></Image>
                  </div>
                  <div className="contact-right">
                    <h1>Contact us</h1>

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
                        <button>Submit</button>
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
