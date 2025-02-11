"use client";
import Image from "next/image";
import styles from "./page.css";
import Header from "./Components/Header/page";
import { CountUp } from "countup.js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

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

export default function Home() {
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
          }, 2000000);
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

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  useEffect(() => {
    const count = new CountUp("target-one", 4);
    if (count.error) {
      console.error(error);
    } else {
      count.start();
    }

    const countTwo = new CountUp("target-two", 224);
    if (countTwo.error) {
      console.error(error);
    } else {
      countTwo.start();
    }

    const countThree = new CountUp("target-three", 22);
    if (countThree.error) {
      console.error(error);
    } else {
      countThree.start();
    }
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

  return (
    <>
      <Header />
      <div className="hero-banner">
        <div className="overlay"></div>
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
      '
      <div className="trust-icons-container">
        <h3 className="section-title">Our Achievements in Architecture</h3>
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
      <div className="what-we-offer">
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
      </div>
      <div className="expertise">
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
      </div>
      <div className="faqs">
        <div className="faq-accordion">
          <h2>
            Frequently <span className="asked">asked</span> questions
          </h2>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
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
      </div>
      <div className="reviews-section">
        <div ref={sliderRef} className="keen-slider">
          <div className="keen-slider__slide number-slide1">
            <div className="testimonial-container">
              <div className="testimonial-box">
                <p className="quote">
                  “We believe that the harmony of the environment is the harmony
                  of the mind, and that courage and strength lie in the form of
                  simplicity. Together with Drowart, hand in hand, we create our
                  visions come true.”
                </p>
                <div className="author">
                  <Image
                    src="/review-one.webp"
                    alt="Sylwia Gieruszyńska"
                    width={50}
                    height={50}
                    className="profile-img"
                  />
                  <div>
                    <h4 className="name">Sylwia Gieruszyńska</h4>
                    <p className="designation">CEO & Co-Founder at HUS</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-image">
                <Image
                  src="/review-one.webp"
                  alt="Team"
                  width={600}
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
                <p className="quote">
                  “We believe that the harmony of the environment is the harmony
                  of the mind, and that courage and strength lie in the form of
                  simplicity. Together with Drowart, hand in hand, we create our
                  visions come true.”
                </p>
                <div className="author">
                  <Image
                    src="/review-one.webp"
                    alt="Sylwia Gieruszyńska"
                    width={50}
                    height={50}
                    className="profile-img"
                  />
                  <div>
                    <h4 className="name">Sylwia Gieruszyńska</h4>
                    <p className="designation">CEO & Co-Founder at HUS</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-image">
                <Image
                  src="/review-one.webp"
                  alt="Team"
                  width={600}
                  height={400}
                  className="team-img"
                />
              </div>
            </div>
          </div>
          <div className="keen-slider__slide number-slide3">3</div>
          <div className="keen-slider__slide number-slide4">4</div>
          <div className="keen-slider__slide number-slide5">5</div>
          <div className="keen-slider__slide number-slide6">6</div>
        </div>
      </div>
      <div className="trust-icons">
        <div className="trust-icons-df">
          <div className="slider">
            <div className="slide-track">
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
              <div className="slide">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png"
                  height="100"
                  width="250"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-logo">
          {/* <Image
            alt="Footer-logo"
            id="footer-logo"
            src={"/Business-Card.png"}
            width={0}
            height={0}
            unoptimized
          ></Image> */}
          <h2>Logo</h2>
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
