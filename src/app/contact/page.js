"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

import urlFor from "../helpers/sanity";
import gsap from "gsap";
import emailjs from "@emailjs/browser";
import "./contact.css";

const ContactPage = () => {
  const textRef = useRef(null);
  const formRef = useRef(null);

  const [data, setData] = useState(null);
  const [mainServiceData, setMainServiceData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const [showForm, setShowForm] = useState(false);

  // --- theme
  useEffect(() => {
    const updateMode = () =>
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    updateMode();
    const obs = new MutationObserver(updateMode);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // --- scroll up
  const upwardHandler = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // --- CMS
  useEffect(() => {
    (async () => {
      try {
        const result = await client.fetch(`*[_type == "contactPage"][0]`);
        setData(result);
        const svc = await client.fetch(`*[_type == "serviceTwoPage"][0]`);
        setMainServiceData(svc);
      } catch (e) {
        console.error("Failed to fetch contact page data:", e);
      }
    })();
  }, []);

  // --- SEO
  useEffect(() => {
    if (!data) return;
    document.title = data.seoTitle || "Contact | ADPL Consulting";
    const metaDesc =
      document.querySelector("meta[name='description']") ||
      (() => {
        const m = document.createElement("meta");
        m.name = "description";
        document.head.appendChild(m);
        return m;
      })();
    metaDesc.setAttribute(
      "content",
      data.seoDescription || "Contact ADPL Consulting"
    );
  }, [data]);

  // --- small anim
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

  /**
   * Helper: pull value by preferred names; if not present,
   * guess by substring on the element's `name` or `placeholder` text.
   */
  const getFlexible = (preferredNames, fallbackRegex) => {
    const f = formRef.current;
    if (!f) return "";

    // 1) direct name match (exact)
    for (const n of preferredNames) {
      const el = f.elements[n];
      if (el && typeof el.value === "string" && el.value.trim()) {
        return el.value.trim();
      }
    }

    // 2) best-guess by regex against name/placeholder
    const fields = Array.from(f.elements).filter(
      (el) =>
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT") &&
        typeof el.name === "string"
    );

    const candidate =
      fields.find((el) => fallbackRegex.test(el.name || "")) ||
      fields.find(
        (el) =>
          typeof el.placeholder === "string" &&
          fallbackRegex.test(el.placeholder)
      );

    return candidate && typeof candidate.value === "string"
      ? candidate.value.trim()
      : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    // keep a stable reference to the form BEFORE any await
    const formEl = formRef.current; // or const formEl = e.currentTarget;

    // FLEX lookups (unchanged)
    const nameVal = getFlexible(
      ["name", "firstName", "fullName", "fullname", "title"],
      /(name|full\s*name|title)/i
    );
    const emailVal = getFlexible(["email", "emailAddress"], /(email|e-mail)/i);
    const phoneVal = getFlexible(
      ["phone", "mobile", "phoneNo", "phone_number"],
      /(phone|mobile|contact\s*number)/i
    );
    const serviceVal = getFlexible(
      ["service", "services", "selectedService"],
      /(service|category|subject)/i
    );
    const messageVal = getFlexible(
      ["message", "msg", "messages", "comment"],
      /(message|query|comments?|details)/i
    );

    // basic validation (unchanged)
    if (!nameVal) {
      setIsSubmitting(false);
      setStatus({ type: "err", msg: "Please enter your name." });
      return;
    }
    if (!emailVal) {
      setIsSubmitting(false);
      setStatus({ type: "err", msg: "Please enter your email." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setIsSubmitting(false);
      setStatus({ type: "err", msg: "Enter a valid email." });
      return;
    }
    if (!phoneVal) {
      setIsSubmitting(false);
      setStatus({ type: "err", msg: "Please enter your phone number." });
      return;
    }

    // honeypot
    const hp = formEl?.querySelector('[name="website"]')?.value;
    if (hp) {
      setIsSubmitting(false);
      setStatus({ type: "ok", msg: "Thanks!" });
      return;
    }

    // system/template fields
    const submittedAtIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
    const year = String(new Date().getFullYear());
    const setHidden = (n, v) => {
      const el = formEl?.querySelector(`[name="${n}"]`);
      if (el) el.value = v ?? "";
    };
    setHidden("submitted_at", submittedAtIST);
    setHidden("year", year);
    setHidden("firstName", nameVal);
    setHidden("service", serviceVal);
    setHidden("email", emailVal);
    setHidden("phone", phoneVal);
    setHidden("message", messageVal);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formEl,
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() }
      );

      // ✅ use the saved form or ref; don't touch e.currentTarget after await
      formEl?.reset();

      setStatus({
        type: "ok",
        msg: "Message sent! We’ll get back to you shortly.",
      });
    } catch (err) {
      console.error("EmailJS error:", err);
      // optional: surface EmailJS message if available
      const msg =
        err?.text || err?.message || "Could not send. Please try again.";
      setStatus({ type: "err", msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Header />

      <div className="contact-container">
        <div className="contact-form-section">
          <h1 className="contact-title">
            {data?.mainHeading || "Get in touch"}
          </h1>
          <div className="title-underline"></div>

          <form ref={formRef} onSubmit={handleSubmit}>
            {/* Render Sanity fields exactly as defined */}
            {data.formFields?.map((field, idx) => (
              <div className="form-field" key={idx}>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.label}
                    required={!!field.required}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.label}
                    required={!!field.required}
                  />
                )}
              </div>
            ))}

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Hidden fields for EmailJS template */}
            <input type="hidden" name="submitted_at" />
            <input type="hidden" name="year" />
            <input type="hidden" name="firstName" />
            <input type="hidden" name="service" />
            {/* Also ensure template can read these, even if visible fields are named differently */}
            <input type="hidden" name="email" />
            <input type="hidden" name="phone" />
            <input type="hidden" name="message" />

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Submit"}
            </button>

            {status && (
              <p
                style={{ marginTop: 10 }}
                className={status.type === "ok" ? "success" : "error"}
              >
                {status.msg}
              </p>
            )}
          </form>
        </div>

        <div className="contact-info-section">
          <div className="map-container">
            {((!isDarkMode && data?.contactImage?.asset) ||
              (isDarkMode && data?.contactImageDarkMode?.asset)) && (
              <Image
                src={
                  isDarkMode
                    ? urlFor(data.contactImageDarkMode).url()
                    : urlFor(data.contactImage).url()
                }
                width={0}
                height={0}
                alt="Map"
                unoptimized
                className="map-image"
              />
            )}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="for-map-wrapper">
        <div className="for-map-container">
          <div className="for-map-left">
            <h2 className="for-map-heading">
              {data?.talkIdeasHeading || "Let’s Talk Ideas"}
            </h2>
            <p className="for-map-description">
              Connect with us to transform your ideas into reality. Whether
              you’re seeking expert advice, have project inquiries, or are ready
              to begin, our team is here to guide you every step of the way.
            </p>

            <div className="for-map-info">
              <div className="for-map-item">
                <span className="for-map-label">Address:</span>
                <span className="for-map-value">
                  {data.contactInfo?.address}
                </span>
              </div>
              <div className="for-map-item">
                <span className="for-map-label">Phone:</span>
                <span className="for-map-value">{data.contactInfo?.phone}</span>
              </div>
              <div className="for-map-item">
                <span className="for-map-label">Email:</span>
                <span className="for-map-value">{data.contactInfo?.email}</span>
              </div>
            </div>
          </div>

          {data?.googleMapEmbedUrl && (
            <div className="for-map-right">
              <iframe
                title="Google Map"
                src={data.googleMapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="why-work">
        <div className="content-two">
          <div className="text">
            <h2>{data?.whyWorkWithUsHeading}</h2>
            {data?.whyWorkWithUsItems?.map((item, idx) => (
              <div className="feature" key={idx}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-check2"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"></path>
                </svg>
                <div className="info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="image-wrapper-contact">
            <div className="background-contact">
              {isDarkMode
                ? mainServiceData?.whyWorkWithUs?.imageDarkMode?.asset && (
                    <Image
                      src={urlFor(
                        mainServiceData.whyWorkWithUs.imageDarkMode
                      ).url()}
                      alt="Why Work Image"
                      width={500}
                      height={400}
                    />
                  )
                : mainServiceData?.whyWorkWithUs?.image?.asset && (
                    <Image
                      src={urlFor(mainServiceData.whyWorkWithUs.image).url()}
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

      {/* Floating bits */}
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
          />
        </a>
      </div>

      <div className="enquire">
        <button onClick={() => setShowForm(true)}>Enquire Now</button>
      </div>

      {showForm && (
        <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
          <div
            className="enquiry-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="enquiry-box">
              <div className="close-icon" onClick={() => setShowForm(false)}>
                ✕
              </div>
              <h2 className="title">Quick Query</h2>
              <p className="subtitle">
                If you have any queries, we will be pleased to assist you.
              </p>
              <form>
                <input type="text" placeholder="Name" className="form-input" />
                <input
                  type="text"
                  placeholder="Mobile No."
                  className="form-input"
                />
                <select className="form-input">
                  <option>Select Type</option>
                  <option>General</option>
                  <option>Support</option>
                  <option>Sales</option>
                </select>
                <textarea
                  placeholder="Query"
                  className="form-input"
                  rows="3"
                ></textarea>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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

export default ContactPage;
