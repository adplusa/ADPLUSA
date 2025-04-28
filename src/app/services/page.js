import React from "react";
import "./services.css";
import Image from "next/image";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";

const Services = () => {
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

      {/* <section className="service-info">
        <div className="service-info-df">
          <div className="service-left">
            <h1>Let us help you with your architecture outsourcing needs</h1>
            <p>
              Is it possible to quickly hire cost-effective architecture
              professionals without compromising quality results?
            </p>
            <h4>With WorldTeams it is.</h4>
            <p>
              The help you need, when you need it. We have remote architects to
              assist in all parts of the production ecosystem. From models and
              renders to full-time staff architects or project managers: let us
              help you make it happen.
            </p>
          </div>
          <div className="service-right">
            <Image
              src={"/service-2.webp"}
              alt="img"
              width={0}
              height={0}
              unoptimized
            ></Image>
          </div>
        </div>
        <div className="service-info-df rotate">
          <div className="service-left">
            <h1>Architecture Outsourcing Services</h1>
            <p>
              Outsourcing architectural services involves delegating specific
              architectural design services traditionally performed in-house to
              a qualified external team. This can encompass various tasks, from
              creating detailed construction drawings and 3D renderings to
              <a href="#"> Building Information Modeling (BIM)</a> and project
              management. Architectural firms can choose to outsource to
              domestic or international partners, depending on the project needs
              and expertise required.
            </p>

            <p>
              TWhile architectural design is a crucial component of the
              outsourcing boom, it’s important to recognize the broader impact.
              When we talk about architectural outsourcing services, we’re not
              just talking about aesthetics. We’re encompassing the entire
              spectrum of architectural expertise, from meticulous planning and
              technical drawings to specialized engineering and construction
              management.
            </p>
          </div>
          <div className="service-right">
            <Image
              src={"/service-3.webp"}
              alt="img"
              width={0}
              height={0}
              unoptimized
            ></Image>
          </div>
        </div>
      </section> */}

      <section className="sepecialize">
        <div className="sepecialize-df">
          <h1>We specialize in outsourcing architectural services</h1>
          <p>
            to help you access a global pool of talented architects, ensuring
            access to the most qualified professionals for your specific project
            requirements, regardless of location.
          </p>
        </div>
      </section>

      <div className="what-we-offer-container">
        <h2 className="section-title">What we offer</h2>
        <p className="section-subtitle">
          Our top architecture outsourcing services
        </p>
        <div className="service-boxes">
          {services.map((service, index) => (
            <div className="service-box" id={`service-box-${index + 1}`}>
              <div className="service-box-inner">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="offer-cta">
          <button>Hire an architect</button>
        </div>
      </div>

      <div className="outsourcing-container">
        <h2 className="section-title">Why Choose Architecture Outsourcing?</h2>
        <div className="outsourcing-boxes">
          {reasons.map((reason, index) => (
            <div className={`outsourcing-box box-${index + 1}`} key={index}>
              <h3 className="outsourcing-title">{reason.title}</h3>
              <p className="outsourcing-description">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="outsourcing-container-two">
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
      </div>

      <div className="cta-container-df">
        <div className="cta-container">
          <div className="cta-text">
            <h2>At WorldTeams,</h2>
            <p>
              we streamline recruitment, allowing you to find and hire top
              architects efficiently. Let us help you make it happen.
            </p>
          </div>
          <button className="cta-button">Hire an architect</button>
        </div>
      </div>

      <div className="most-wanter">
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
      </div>

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
      </div>

      <div className="cta-container-df" id="cta-small-parent">
        <div className="cta-container" id="cta-small">
          <div className="cta-text">
            <p>Need a hand?</p>
          </div>
          <button className="cta-button">Hire an Architect Now</button>
        </div>
      </div>

      <div className="stay-updated">
        <h2 className="section-title">Stay Updated</h2>
        <div className="cards-container">
          {articles.map((article, index) => (
            <div className={`card card-${index + 1}`} key={index}>
              <img
                src={article.image}
                alt={article.alt}
                className="card-image"
              />
              <div className="card-text">
                <h3 className="card-title">{article.title}</h3>
                <p className="card-description">{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="other-services-container">
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
      </div>

      <Footer />
    </>
  );
};

export default Services;
