"use client";
import Image from "next/image";
import styles from "./page.css";
import Header from "./Components/Header/page";
import { CountUp } from "countup.js";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { gsap } from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeStep, setActiveStep] = useState(steps[0].id);

  const [logo, setLogo] = useState("/red-logo.png");
  const textRef = useRef(null);

  const [valueOne, setValueOne] = useState(0);
  const [valueTwo, setValueTwo] = useState(0);
  const [valueThree, setValueThree] = useState(0);
  const [valueFour, setValueFour] = useState(0);
  const [valueFive, setValueFive] = useState(0);
  const [valueSix, setValueSix] = useState(0);
  const textRefs = useRef([]);
  const [open, setOpen] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
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
          }, 100000000);
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

  const handleClick = () => {
    setActive(!active);
  };

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  useEffect(() => {
    const intervalOne = setInterval(() => {
      setValueOne((prev) => (prev < 50 ? prev + 1 : 50));
    }, 20);

    const intervalTwo = setInterval(() => {
      setValueTwo((prev) => (prev < 75 ? prev + 1 : 75));
    }, 20);

    const intervalThree = setInterval(() => {
      setValueThree((prev) => (prev < 90 ? prev + 1 : 90));
    }, 20);

    const intervalFour = setInterval(() => {
      setValueFour((prev) => (prev < 80 ? prev + 1 : 80));
    }, 20);
    const intervalFive = setInterval(() => {
      setValueFive((prev) => (prev < 80 ? prev + 1 : 80));
    }, 20);
    const intervalSix = setInterval(() => {
      setValueSix((prev) => (prev < 80 ? prev + 1 : 80));
    }, 20);

    return () => {
      clearInterval(intervalOne);
      clearInterval(intervalTwo);
      clearInterval(intervalThree);
      clearInterval(intervalFour);
      clearInterval(intervalFive);
      clearInterval(intervalSix);
    };
  }, []);

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

  useEffect(() => {
    const updateLogo = () => {
      setLogo(
        document.body.classList.contains("dark-mode")
          ? "/white-logo.png"
          : "/red-logo.png"
      );
    };

    // Run on mount
    updateLogo();

    // Observe for changes
    const observer = new MutationObserver(() => {
      updateLogo();
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect(); // Cleanup observer
  }, []);

  useEffect(() => {
    gsap.to(textRef.current, {
      rotation: 360,
      transformOrigin: "center",
      repeat: -1,
      duration: 8,
      ease: "linear",
    });
  }, []);

  return (
    <>
      <Header />
      <div className="hero-banner">
        <div className="overlay"></div>
      </div>

      <div className="service-two">
        <div className="service-two-top">
          <div className="service-two-top-left">
            <h5>Company Services</h5>
            <h1>We specialize in these fields.</h1>
          </div>
          <div className="service-two-top-right">
            <p>
              We offer a comprehensive range of services tailored to the steel
              industry. Our expertise includes BIM services, CAD services, and
              Permit Drawings & Documentation. We also provide advanced 3D
              Visualization and high-quality Presentation Drawings.
              Additionally, our MEP services ensure seamless integration of
              mechanical, electrical, and plumbing systems.
            </p>
          </div>
        </div>
        <div className="service-two-bottom">
          <div className="service-two-bottom-left">
            <div className="service-two-bottom-box" id="service-two-box-one">
              <div className="service-two-bottom-box-top">
                <span className="service-two-bottom-box-logo">
                  <Image
                    src={"/icon.png"}
                    width={60}
                    height={60}
                    unoptimized
                    alt="icon-image"
                  ></Image>
                </span>
                <h3>BIM services</h3>
              </div>
              <div className="service-two-bottom-box-bottom">
                <p>
                  Our BIM team consists of architects, engineers and designers
                  offering holistic solutions.
                </p>
              </div>
            </div>
            <div className="service-two-bottom-box" id="service-two-box-one">
              <div className="service-two-bottom-box-top">
                <span className="service-two-bottom-box-logo">
                  <Image
                    src={"/icon.png"}
                    width={60}
                    height={60}
                    unoptimized
                    alt="icon-image"
                  ></Image>
                </span>
                <h3>CAD services</h3>
              </div>
              <div className="service-two-bottom-box-bottom">
                <p>
                  Providing extended architectural and structural design and
                  drafting services for all stages of your project
                </p>
              </div>
            </div>
            <div className="service-two-bottom-box" id="service-two-box-one">
              <div className="service-two-bottom-box-top">
                <span className="service-two-bottom-box-logo">
                  <Image
                    src={"/icon.png"}
                    width={60}
                    height={60}
                    unoptimized
                    alt="icon-image"
                  ></Image>
                </span>
                <h3>Permit Drawings & Documentation</h3>
              </div>
              <div className="service-two-bottom-box-bottom">
                <p>
                  Contact us and save the cumbersome job of authority approvals.
                </p>
              </div>
            </div>
            <div className="service-two-bottom-box" id="service-two-box-one">
              <div className="service-two-bottom-box-top">
                <span className="service-two-bottom-box-logo">
                  <Image
                    src={"/icon.png"}
                    width={60}
                    height={60}
                    unoptimized
                    alt="icon-image"
                  ></Image>
                </span>
                <h3>3d Visualization</h3>
              </div>
              <div className="service-two-bottom-box-bottom">
                <p>
                  Get the full experience of your building before hand by our 3D
                  experts.
                </p>
              </div>
            </div>
            <div className="service-two-bottom-box" id="service-two-box-one">
              <div className="service-two-bottom-box-top">
                <span className="service-two-bottom-box-logo">
                  <Image
                    src={"/icon.png"}
                    width={60}
                    height={60}
                    unoptimized
                    alt="icon-image"
                  ></Image>
                </span>
                <h3>Presentation Drawings</h3>
              </div>
              <div className="service-two-bottom-box-bottom">
                <p>
                  We provide comprehensive research data which captivate our
                  clients, at the lowest possible cost.
                </p>
              </div>
            </div>
            <div className="service-two-bottom-box" id="service-two-box-one">
              <div className="service-two-bottom-box-top">
                <span className="service-two-bottom-box-logo">
                  <Image
                    src={"/icon.png"}
                    width={60}
                    height={60}
                    unoptimized
                    alt="icon-image"
                  ></Image>
                </span>
                <h3>MEP Services</h3>
              </div>
              <div className="service-two-bottom-box-bottom">
                <p>
                  We strive to provide high-quality and reliable structural,
                  mechanical and electrical engineering solutions.
                </p>
              </div>
            </div>
          </div>
          <div className="service-two-bottom-right">
            <video muted autoPlay loop>
              <source src="/service-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="services-one_circle-color"></div>
        </div>
        {/* <div className="achievement-grid">
          <div className="achievement-card">
            <div className="icon-wrapper">
              <svg
                width="30px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 21V3H21V21H16V17H8V21H3Z"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 7H16M8 11H16M8 15H16"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="target-one">4+</h2>
            <p>Years of Excellence</p>
          </div>

          <div className="achievement-card">
            <div className="icon-wrapper">
              <svg
                width="30px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L14.09 8.26L21 9.27L15.5 13.97L16.82 21L12 17.77L7.18 21L8.5 13.97L3 9.27L9.91 8.26L12 2Z"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="target-three">22</h2>
            <p>Awards Won</p>
          </div>

          <div className="achievement-card">
            <div className="icon-wrapper">
              <svg
                width="30px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 21V5L12 2L21 5V21H3Z"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2V12"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21V14H15V21"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="target-two">224</h2>
            <p>Projects Completed</p>
          </div>
        </div> */}
      </div>

      <div className="about-us">
        <h2>
          who <br />
          we are?
        </h2>
        <div className="about-us-top">
          <div className="about-us-top-left">
            <h1>Allow us to introduce ourselves</h1>
          </div>
          <div className="about-us-top-right">
            <h1>
              <span className="asked">Welcome</span> to ADPL Consulting LLC
            </h1>
            <p>
              ADPL CONSULTING LLC works as a leading Architectural and
              Engineering outsource fraternity across India and the United
              States of America.
            </p>
            <p>
              We are a group of professionals with profound proficiency in the
              field of architecture, engineering, designing, interiors, and
              management. Having an established track record of serving more
              than 150 clients in 535+ projects, our strict adherence to
              international standards and global experience makes us the
              paramount service provider in the market.
            </p>
            <span>
              <div className="key-benefit">
                <span>
                  <ul>
                    <li>Experienced Team</li>
                    <li>Outsourcing</li>
                    <li>Affordable Prices</li>
                    <li>Best Quality</li>
                  </ul>
                </span>
                <span>
                  <ul>
                    <li>Unique/Iconic Designs</li>
                    <li>Strict Timelines</li>
                    <li>Proficency with SketchUp Pro</li>
                    <li>Excellence in Revit & BIM</li>
                  </ul>
                </span>
              </div>
            </span>
          </div>
        </div>

        <div className="circle-container">
          <Image
            src={logo}
            alt="logo"
            className="center-image"
            width={120}
            height={120}
          />

          {/* Rotating Circular Text */}
          <svg viewBox="0 0 250 250" className="circle-text" ref={textRef}>
            <defs>
              <path
                id="circlePath"
                d="M 125, 125 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0"
              />
            </defs>
            <text
              fontSize="20"
              fontWeight="bold"
              letterSpacing="3"
              fill="#c94446"
            >
              <textPath href="#circlePath" startOffset="0%">
                🔹 ADPL CONSULTING LLC 🔹 ARCHITECTURAL & ENGINEERING 🔹
              </textPath>
            </text>
          </svg>
        </div>
      </div>
      <div className="about-us-video-image">
        <div className="about-us-img">
          <Image
            id="pawel"
            src={"Pawel.avif"}
            alt="about-us image"
            width={0}
            height={0}
            unoptimized
          ></Image>

          <video muted autoPlay loop>
            <source src="/architect2.mp4" type="video/mp4" />
          </video>

          <Image
            id="vladimir"
            src={"Vladimir.avif"}
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
              <span>Who we are</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="strip-text">
        <div className="marquee">
          <p>
            ADPL CONSULTING LLC works as a leading Architectural and Engineering
            outsource fraternity across India and the United States of America.
          </p>
        </div>
      </div>

      {/* <div className="what-we-offer">
        <div className="what-we-offer-text">
          <h1>Get Quote</h1>
        </div>

        <div className="what-we-offer-images">
          <div className="what-we-offer-img" id="what-we-offer-img-one">
            <div className="what-we-offer-overlay"></div>
            <Image
              src={"/PORTFOLIO-1.avif"}
              width={0}
              height={0}
              alt="Offer Image"
              unoptimized
            ></Image>
            <div className="what-we-offer-content">
              <h1>Get Quote: CAD Services</h1>
              <p>
                Permit Drawings / Documentation - MEP Services - Fire Fighting
                Drawings - PDF to CAD
              </p>
              <div className="what-we-offer-content-btn">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                    />
                  </svg>
                </span>

                <button>Get a Quote</button>
              </div>
            </div>
          </div>
          <div className="what-we-offer-img" id="what-we-offer-img-one">
            <div className="what-we-offer-overlay"></div>

            <Image
              src={"/PORTFOLIO-2.avif"}
              width={0}
              height={0}
              alt="Offer Image"
              unoptimized
            ></Image>
            <div className="what-we-offer-content">
              <h1>Get Quote: BIM Services</h1>
              <p>
                BIM Services - Building information Modulation - Cost & Estimate
                - BOQ - Energy Analysis
              </p>
              <div className="what-we-offer-content-btn">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                    />
                  </svg>
                </span>

                <button>Get a Quote</button>
              </div>
            </div>
          </div>
          <div className="what-we-offer-img" id="what-we-offer-img-one">
            <div className="what-we-offer-overlay"></div>

            <video muted autoPlay loop>
              <source src="/PORTFOLIO-3.mp4" type="video/mp4" />
            </video>
            <div className="what-we-offer-content">
              <h1>2D & 3D Rendering</h1>
              <p>
                2D Presentation Drawings - Visualization - 3D Visualization - 3D
                Modeling & rendering - Walkthrough
              </p>
              <div className="what-we-offer-content-btn">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                    />
                  </svg>
                </span>

                <button>Get a Quote</button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="expertise">
        <h1>Our Services</h1>
        <ul>
          <li className="right-side-li" id="first-service">
            <div className="link-wrapper" id="first-wrapper">
              <a href="#">BIM.</a>
              <p className="link-para">
                Our BIM team delivers holistic solutions with
                <br /> architects, engineers, and designers.
              </p>
            </div>
          </li>

          <li className="left-side-li" id="second-service">
            <div className="link-wrapper" id="left-wrapper">
              <a href="#">CAD.</a>
              <p className="link-para">
                We offer architectural and structural design services
                <br /> for all project stages.
              </p>
            </div>
          </li>

          <li id="service-three">
            <div className="link-wrapper" id="third-wrapper">
              <a href="#">Permit Drawing.</a>
              <p className="link-para">
                Contact us to simplify authority approvals.
              </p>
            </div>
          </li>

          <li className="left-side-li" id="service-four">
            <div className="link-wrapper" id="four-wrapper">
              <a href="#">3D Visualization.</a>
              <p className="link-para">
                Experience your building in 3D with our expert team.
              </p>
            </div>
          </li>

          <li id="service-five">
            <div className="link-wrapper" id="five-wrapper">
              <a href="#">Prsentation.</a>
              <p className="link-para">
                We provide cost-effective, compelling research data.
              </p>
            </div>
          </li>

          <li className="left-side-li" id="six-service">
            <div className="link-wrapper" id="left-wrapper">
              <a href="#">MEP.</a>
              <p className="link-para">
                We offer reliable structural, mechanical, and
                <br /> electrical engineering solutions.
              </p>
            </div>
          </li>
        </ul>
      </div> */}

      <div className="feature-section">
        <div className="feature-section-df">
          <div className="feature-left">
            <h4>overall progress</h4>
            <h1>Our Features</h1>
            <p>
              Showcasing cutting-edge designs and innovative solutions tailored
              for modern architecture and interiors.
            </p>
            <div className="features-paras">
              <ul>
                <div className="progress-item">
                  <div className="progress-item-df">
                    <p>Maintenance Support</p>
                    <Image
                      src={"1.png"}
                      width={50}
                      height={50}
                      unoptimized
                      alt="Maintenance"
                    ></Image>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${valueOne}%` }}
                    ></div>
                  </div>
                </div>

                <div className="progress-item">
                  <div className="progress-item-df">
                    <p>Cost-Effective</p>
                    <Image
                      src={"2.png"}
                      width={50}
                      height={50}
                      unoptimized
                      alt="Maintenance"
                    ></Image>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${valueTwo}%` }}
                    ></div>
                  </div>
                </div>

                <div className="progress-item">
                  <div className="progress-item-df">
                    <p>Swift Deliverance</p>
                    <Image
                      src={"3.png"}
                      width={50}
                      height={50}
                      unoptimized
                      alt="Maintenance"
                    ></Image>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${valueThree}%` }}
                    ></div>
                  </div>
                </div>
              </ul>

              <ul>
                <div className="progress-item">
                  <div className="progress-item-df">
                    <p>Software Expertise</p>
                    <Image
                      src={"4.png"}
                      width={50}
                      height={50}
                      unoptimized
                      alt="Maintenance"
                    ></Image>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${valueFour}%` }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-item-df">
                    <p>Newest Technology</p>
                    <Image
                      src={"5.png"}
                      width={50}
                      height={50}
                      unoptimized
                      alt="Maintenance"
                    ></Image>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${valueFive}%` }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-item-df">
                    <p>23+ years of experience</p>
                    <Image
                      src={"6.png"}
                      width={50}
                      height={50}
                      unoptimized
                      alt="Maintenance"
                    ></Image>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${valueSix}%` }}
                    ></div>
                  </div>
                </div>
              </ul>
            </div>
          </div>

          <div className="feature-right">
            <Image
              src={"/feature-img1.jpg"}
              alt="feature-img"
              width={0}
              height={0}
              unoptimized
              priority
            ></Image>
            <Image
              src={"/feature-img3.jpg"}
              alt="feature-img"
              width={0}
              height={0}
              unoptimized
              priority
            ></Image>
          </div>
        </div>

        <div className="achievement-grid">
          <div className="achievement-card">
            <div className="icon-wrapper">
              <svg
                width="30px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 21V3H21V21H16V17H8V21H3Z"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 7H16M8 11H16M8 15H16"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="target-one">4+</h2>
            <p>Years of Excellence</p>
          </div>

          <div className="achievement-card">
            <div className="icon-wrapper">
              <svg
                width="30px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L14.09 8.26L21 9.27L15.5 13.97L16.82 21L12 17.77L7.18 21L8.5 13.97L3 9.27L9.91 8.26L12 2Z"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="target-three">22</h2>
            <p>Awards Won</p>
          </div>

          <div className="achievement-card">
            <div className="icon-wrapper">
              <svg
                width="30px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 21V5L12 2L21 5V21H3Z"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2V12"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21V14H15V21"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="target-two">224</h2>
            <p>Projects Completed</p>
          </div>
        </div>
      </div>

      <div className="process-steps">
        <h1 id="process-heading">
          Our <span>Working Process</span>
        </h1>
        <div className="process-steps-df">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`process-steps-box ${
                activeStep === step.id ? "active" : ""
              }`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="process-steps-line"></div>{" "}
              {/* Line between steps */}
              <div className="process-steps-dot"></div>
              <h1>{step.id}</h1>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
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
              <div className={`faq-answer ${open === index ? "open" : ""}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
        <div className="faq-sketch"></div>
      </div>

      <section class="testimonial-section">
        <div class="testimonial-header">
          <h2>What Our Clients Say</h2>
          <p>See how we've helped businesses achieve their goals.</p>
        </div>

        <div class="testimonial-slider">
          <div class="testimonial-slide">
            <div class="testimonial-card">
              <img
                src="image1.jpg"
                alt="Client Name"
                class="testimonial-image-two"
              />
              <p class="testimonial-feedback">
                "Great service, highly recommend!"
              </p>
              <h4 class="testimonial-name">Client Name</h4>
              <span class="testimonial-role">CEO, Company</span>
            </div>
          </div>
        </div>
      </section>

      <div className="reviews-section">
        <div ref={sliderRef} className="keen-slider">
          <div className="keen-slider__slide number-slide1">
            <div className="testimonial-container">
              <div className="testimonial-box">
                <h2>Our Founder & Principal Architect</h2>
                <p>
                  “An Indian, living in the capital city of India; Delhi, is an
                  award-winning architect, who incorporated a company with a
                  clear intent to foster an egalitarian organizational ethos
                  where distinctive architectural talent finds self-expression
                  and can contribute in a democratic and collaborative work
                  environment.”
                </p>
                <p>
                  Focused on core competencies in the field of Architecture,
                  Interior Designing, Consulting Engineering, and other Allied
                  Services and having an experience of 22+ Yrs.
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
                {/* <div className="achievement-grid">
                  <div className="achievement-card">
                    <div className="icon-wrapper">
                      <svg
                        width="30px"
                        height="64px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 21V3H21V21H16V17H8V21H3Z"
                          stroke="#222"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 7H16M8 11H16M8 15H16"
                          stroke="#222"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 id="target-one">4+</h2>
                    <p>Years of Excellence</p>
                  </div>

                  <div className="achievement-card">
                    <div className="icon-wrapper">
                      <svg
                        width="30px"
                        height="64px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L14.09 8.26L21 9.27L15.5 13.97L16.82 21L12 17.77L7.18 21L8.5 13.97L3 9.27L9.91 8.26L12 2Z"
                          stroke="#222"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 id="target-three">22</h2>
                    <p>Awards Won</p>
                  </div>

                  <div className="achievement-card">
                    <div className="icon-wrapper">
                      <svg
                        width="30px"
                        height="64px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 21V5L12 2L21 5V21H3Z"
                          stroke="#222"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2V12"
                          stroke="#222"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 21V14H15V21"
                          stroke="#222"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 id="target-two">224</h2>
                    <p>Projects Completed</p>
                  </div>
                </div> */}
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
                  “An Indian, living in the capital city of India; Delhi, is an
                  award-winning architect, who incorporated a company with a
                  clear intent to foster an egalitarian organizational ethos
                  where distinctive architectural talent finds self-expression
                  and can contribute in a democratic and collaborative work
                  environment.”
                </p>
                <p>
                  Focused on core competencies in the field of Architecture,
                  Interior Designing, Consulting Engineering, and other Allied
                  Services and having an experience of 22+ Yrs.
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
      </div>

      <div className="footer">
        <div className="footer-logo">
          <Image
            src={"/red-logo.png"}
            alt="Footer-logo"
            id="footer-logo"
            width={0}
            height={0}
            unoptimized
          ></Image>
          <p>
            ADPL CONSULTING LLC works as a leading Architectural and Engineering
            <br />
            outsource fraternity across India and the United States of America.
          </p>
        </div>
        <div className="footer-nav">
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Portfolio</a>
            </li>
            <li>
              <a href="#">Get a Quote</a>
            </li>
            <li>
              <a href="#">Competition: Contact-Less Restroom</a>
            </li>
          </ul>
        </div>

        <div className="social-media">
          <span className="blue-back">Dr</span>
          <span className="blue-back">Be</span>
          <span className="blue-back">Ig</span>
          <span className="blue-back">Tw</span>
        </div>

        <span id="blue-border-div">
          <hr className="blue-border" />
        </span>

        <p id="copyright">Copyright Adplusa</p>
      </div>
    </>
  );
}
