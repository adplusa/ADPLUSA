// "use client";

// import { useEffect, useRef, useState } from "react";
// import Header from "../Components/Header/page";
// import Footer from "../Components/Footer/page";
// import Image from "next/image";
// import { client } from "@/sanity/lib/client";
// import urlFor from "../helpers/sanity";
// import gsap from "gsap";
// import "./contact.css";

// const ContactPage = () => {
//   const textRef = useRef(null);
//   const [data, setData] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [showForm, setShowForm] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [mainServiceData, setMainServiceData] = useState(null);

//   useEffect(() => {
//     const updateMode = () => {
//       setIsDarkMode(document.body.classList.contains("dark-mode"));
//     };
//     updateMode();
//     const observer = new MutationObserver(updateMode);
//     observer.observe(document.body, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     return () => observer.disconnect();
//   }, []);

//   const upwardHandler = () => window.scrollTo({ top: 0, behavior: "smooth" });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await client.fetch(`*[_type == "contactPage"][0]`);
//         setData(result);
//         const mainServiceData = await client.fetch(
//           `*[_type == "serviceTwoPage"][0]`
//         );
//         setMainServiceData(mainServiceData);
//       } catch (error) {
//         console.error("Failed to fetch contact page data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!data) return; // Prevent null error

//     document.title = data.seoTitle;

//     const metaDesc = document.querySelector("meta[name='description']");
//     if (metaDesc) {
//       metaDesc.setAttribute("content", data.seoDescription);
//     } else {
//       const meta = document.createElement("meta");
//       meta.name = "description";
//       meta.content = "Learn about our mission and team";
//       document.head.appendChild(meta);
//     }
//   }, [data]); // Re-run when `data` becomes available

//   useEffect(() => {
//     if (textRef.current) {
//       gsap.to(textRef.current, {
//         rotation: 360,
//         transformOrigin: "center",
//         repeat: -1,
//         duration: 8,
//         ease: "linear",
//       });
//     }
//   }, []);

//   const handleChange = (e) => {
//     const value =
//       e.target.type === "checkbox" ? e.target.checked : e.target.value;
//     setFormData({ ...formData, [e.target.name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Add API call or Sanity write logic here
//   };

//   if (!data) return <div>Loading...</div>;

//   return (
//     <>
//       <Header />

//       <div className="contact-container">
//         <div className="contact-form-section">
//           <h1 className="contact-title">
//             {data?.mainHeading || "Get in touch"}
//           </h1>
//           <div className="title-underline"></div>

//           <form onSubmit={handleSubmit}>
//             {data.formFields?.map((field, idx) => (
//               <div className="form-field" key={idx}>
//                 {field.type === "textarea" ? (
//                   <textarea
//                     name={field.name}
//                     placeholder={field.label}
//                     required={
//                       field.required || ["name", "phone"].includes(field.name)
//                     }
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   <input
//                     type={field.type}
//                     name={field.name}
//                     placeholder={field.label}
//                     required={
//                       field.required || ["name", "phone"].includes(field.name)
//                     }
//                     onChange={handleChange}
//                   />
//                 )}
//               </div>
//             ))}

//             <button type="submit" className="submit-button">
//               Submit
//             </button>
//           </form>
//         </div>

//         <div className="contact-info-section">
//           <div className="map-container">
//             <Image
//               src={
//                 isDarkMode
//                   ? urlFor(data.contactImageDarkMode).url()
//                   : urlFor(data.contactImage).url()
//               }
//               width={0}
//               height={0}
//               alt="Map"
//               unoptimized
//               className="map-image"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Contact Info Section */}
//       <section className="for-map-wrapper">
//         <div className="for-map-container">
//           <div className="for-map-left">
//             <h2 className="for-map-heading">
//               {data?.talkIdeasHeading || "Let’s Talk Ideas"}
//             </h2>
//             <p className="for-map-description">
//               Connect with us to transform your ideas into reality. Whether
//               you’re seeking expert advice, have project inquiries, or are ready
//               to begin, our team is here to guide you every step of the way.
//             </p>

//             <div className="for-map-info">
//               <div className="for-map-item">
//                 <span className="for-map-label">Address:</span>
//                 <span className="for-map-value">
//                   {data.contactInfo?.address}
//                 </span>
//               </div>
//               <div className="for-map-item">
//                 <span className="for-map-label">Phone:</span>
//                 <span className="for-map-value">{data.contactInfo?.phone}</span>
//               </div>
//               <div className="for-map-item">
//                 <span className="for-map-label">Email:</span>
//                 <span className="for-map-value">{data.contactInfo?.email}</span>
//               </div>
//             </div>
//           </div>

//           {data?.googleMapEmbedUrl && (
//             <div className="for-map-right">
//               <iframe
//                 title="Google Map"
//                 src={data.googleMapEmbedUrl}
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               ></iframe>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Why Work With Us */}
//       <section className="why-work">
//         <div className="content-two">
//           <div className="text">
//             <h2>{data?.whyWorkWithUsHeading}</h2>
//             {data?.whyWorkWithUsItems?.map((item, idx) => (
//               <div className="feature" key={idx}>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   className="bi bi-check2"
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"></path>
//                 </svg>
//                 <div className="info">
//                   <h3>{item.title}</h3>
//                   <p>{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="image-wrapper-contact">
//             <div className="background-contact">
//               {isDarkMode
//                 ? mainServiceData?.whyWorkWithUs?.imageDarkMode?.asset && (
//                     <Image
//                       src={urlFor(
//                         mainServiceData.whyWorkWithUs.imageDarkMode
//                       ).url()}
//                       alt="Why Work Image"
//                       width={500}
//                       height={400}
//                     />
//                   )
//                 : mainServiceData?.whyWorkWithUs?.image?.asset && (
//                     <Image
//                       src={urlFor(mainServiceData.whyWorkWithUs.image).url()}
//                       alt="Why Work Image"
//                       width={500}
//                       height={400}
//                     />
//                   )}
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />

//       <div className="whatsapp">
//         <a
//           className="btn-whatsapp-pulse"
//           target="_blank"
//           href="https://wa.me/919910085603/?text=I%20would%20like%20to%20know%20about%20ADPL%20Consulting%20LLC%20!"
//         >
//           <Image
//             src={"/whatsapp.png"}
//             width={40}
//             height={40}
//             alt="Whatsapp-img"
//             unoptimized
//           ></Image>
//         </a>
//       </div>

//       <div className="enquire">
//         <button onClick={() => setShowForm(true)}>Enquire Now</button>
//       </div>
//       {showForm && (
//         <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
//           <div
//             className="enquiry-container"
//             onClick={(e) => e.stopPropagation()} // Prevent close on form click
//           >
//             <div className="enquiry-box">
//               <div className="close-icon" onClick={() => setShowForm(false)}>
//                 ✕
//               </div>
//               <h2 className="title">Quick Query</h2>
//               <p className="subtitle">
//                 If you have any queries, we will be pleased to assist you.
//               </p>
//               <form>
//                 <input type="text" placeholder="Name" className="form-input" />
//                 <input
//                   type="text"
//                   placeholder="Mobile No."
//                   className="form-input"
//                 />
//                 <select className="form-input">
//                   <option>Select Type</option>
//                   <option>General</option>
//                   <option>Support</option>
//                   <option>Sales</option>
//                 </select>
//                 <textarea
//                   placeholder="Query"
//                   className="form-input"
//                   rows="3"
//                 ></textarea>

//                 <button type="submit" className="submit-button">
//                   Submit
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="upward" onClick={upwardHandler}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           fill="currentColor"
//           className="bi bi-chevron-up"
//           viewBox="0 0 16 16"
//         >
//           <path
//             fillRule="evenodd"
//             d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
//           />
//         </svg>
//       </div>
//     </>
//   );
// };

// export default ContactPage;
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

  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  // ----- theme toggle listener
  useEffect(() => {
    const updateMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };
    updateMode();
    const observer = new MutationObserver(updateMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ----- scroll up
  const upwardHandler = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ----- fetch CMS content
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "contactPage"][0]`);
        setData(result);
        const serviceTwo = await client.fetch(
          `*[_type == "serviceTwoPage"][0]`
        );
        setMainServiceData(serviceTwo);
      } catch (error) {
        console.error("Failed to fetch contact page data:", error);
      }
    };
    fetchData();
  }, []);

  // ----- SEO
  useEffect(() => {
    if (!data) return;
    document.title = data.seoTitle || "Contact | ADPL Consulting";
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        data.seoDescription || "Contact ADPL Consulting"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = data.seoDescription || "Contact ADPL Consulting";
      document.head.appendChild(meta);
    }
  }, [data]);

  // ----- small animation
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

  // ----- form helpers
  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const validate = (payload) => {
    const e = {};
    if (!payload.name?.trim()) e.name = "Please enter your name.";
    if (!payload.email?.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      e.email = "Enter a valid email.";
    if (!payload.phone?.trim()) e.phone = "Please enter your phone number.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const errs = validate(formData);
    if (Object.keys(errs).length) {
      setStatus({ type: "err", msg: Object.values(errs)[0] });
      setIsSubmitting(false);
      return;
    }

    // Honeypot
    const hp = formRef.current?.querySelector('[name="website"]')?.value;
    if (hp) {
      setIsSubmitting(false);
      setStatus({ type: "ok", msg: "Thanks!" });
      return;
    }

    // System fields for the EmailJS template
    const submittedAtIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
    const year = String(new Date().getFullYear());

    const submittedAtEl = formRef.current?.querySelector(
      '[name="submitted_at"]'
    );
    const yearEl = formRef.current?.querySelector('[name="year"]');
    if (submittedAtEl) submittedAtEl.value = submittedAtIST;
    if (yearEl) yearEl.value = year;

    // Mirror Sanity's visible "name" to template's expected "firstName"
    const firstNameEl = formRef.current?.querySelector('[name="firstName"]');
    if (firstNameEl) firstNameEl.value = formData.name || "";

    // If your Sanity field is "services" instead of "service", make sure the template receives "service"
    const serviceEl = formRef.current?.querySelector('[name="service"]');
    if (serviceEl && !formData.service) {
      // try a couple of common alternate names from schemas
      serviceEl.value = formData.services || formData.selectedService || "";
    }

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() }
      );
      e.currentTarget.reset();
      setFormData({});
      setStatus({
        type: "ok",
        msg: "Message sent! We’ll get back to you shortly.",
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: "err", msg: "Could not send. Please try again." });
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
            {/* Sanity-driven fields */}
            {data.formFields?.map((field, idx) => (
              <div className="form-field" key={idx}>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name} // e.g. "name", "email", "phone", "service", "message"
                    placeholder={field.label}
                    required={
                      field.required || ["name", "phone"].includes(field.name)
                    }
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.label}
                    required={
                      field.required || ["name", "phone"].includes(field.name)
                    }
                    onChange={handleChange}
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
            {/* Hidden fields required by your EmailJS template */}
            <input type="hidden" name="submitted_at" />
            <input type="hidden" name="year" />
            <input type="hidden" name="firstName" />{" "}
            {/* mirrors visible `name` */}
            <input type="hidden" name="service" />{" "}
            {/* ensures service is present even if schema named it differently */}
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
              ></iframe>
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

      {/* WhatsApp, Enquiry modal, Up arrow – unchanged */}
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
