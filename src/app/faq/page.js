// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import "./faq.css";
// import Header from "../Components/Header/page";
// import Footer from "../Components/Footer/page";

// export default function FAQ() {
//   // FAQ data for each category
//   const categories = [
//     {
//       title: "Product Information",
//       description:
//         "Everything you need to know about our product features. Can't find the answer you're looking for? Please chat to our friendly team.",
//       chatLink: "/contact",
//       image: "/first-internal-img-2.webp",
//       faqs: [
//         {
//           icon: "heart",
//           question: "Is there a free trial available?",
//           answer:
//             "Yes, you can try us for free for 30 days. Our friendly team will work with you to get you up and running as soon as possible.",
//         },
//         {
//           icon: "refresh",
//           question: "Can I change my plan later?",
//           answer:
//             "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.",
//         },
//         {
//           icon: "block",
//           question: "What is your cancellation policy?",
//           answer:
//             "We understand that things change. You can cancel your plan at any time and we'll refund you the difference already paid.",
//         },
//         {
//           icon: "document",
//           question: "Can other info be added to an invoice?",
//           answer:
//             "At the moment, the only way to add additional information to invoices is to add the information to the workspace's name.",
//         },
//       ],
//     },
//     {
//       title: "Billing Questions",
//       description:
//         "Answers to common questions about billing and payments. Need more clarification? Our support team is ready to help.",
//       chatLink: "/contact",
//       image: "/first-internal-img-1.webp",

//       faqs: [
//         {
//           icon: "card",
//           question: "Which payment methods do you accept?",
//           answer:
//             "We accept all major credit cards, PayPal, and for annual plans, we also accept wire transfers.",
//         },
//         {
//           icon: "calendar",
//           question: "How often will I be billed?",
//           answer:
//             "You can choose between monthly or annual billing. Annual plans come with a 20% discount compared to monthly billing.",
//         },
//         {
//           icon: "document",
//           question: "Can other info be added to an invoice?",
//           answer:
//             "At the moment, the only way to add additional information to invoices is to add the information to the workspace's name.",
//         },
//         {
//           icon: "globe",
//           question: "Do you offer regional pricing?",
//           answer:
//             "Yes, we offer regional pricing for select countries. The prices will be adjusted automatically based on your location.",
//         },
//       ],
//     },
//     {
//       title: "Technical Support",
//       description:
//         "Common technical issues and their solutions. If you need more specialized help, our technical team is just one message away.",
//       chatLink: "/contact",
//       image: "/first-internal-img-4.webp",

//       faqs: [
//         {
//           icon: "key",
//           question: "How do I reset my password?",
//           answer:
//             "You can reset your password by clicking on the 'Forgot password' link on the login page. We'll send you an email with instructions.",
//         },
//         {
//           icon: "users",
//           question: "How do I add team members?",
//           answer:
//             "Go to your account settings, select the 'Team' tab, and click on 'Invite members'. You can add members by email address.",
//         },
//         {
//           icon: "data",
//           question: "Is my data secure?",
//           answer:
//             "Yes, we take security seriously. All data is encrypted at rest and in transit. We also perform regular security audits.",
//         },
//         {
//           icon: "device",
//           question: "Which devices are supported?",
//           answer:
//             "Our platform works on all modern browsers and devices, including desktops, tablets, and mobile phones.",
//         },
//       ],
//     },
//   ];

//   // State to track which FAQs are open
//   const [openFaqs, setOpenFaqs] = useState({});

//   // Toggle FAQ open/closed state
//   const toggleFaq = (categoryIndex, faqIndex) => {
//     const key = `${categoryIndex}-${faqIndex}`;
//     setOpenFaqs({
//       ...openFaqs,
//       [key]: !openFaqs[key],
//     });
//   };

//   return (
//     <>
//       <Header />
//       <div className="faq-head">
//         <h1>Frequently Asked Question</h1>
//         <hr />
//       </div>
//       <div className="faq-container">
//         {categories.map((category, categoryIndex) => (
//           <section key={categoryIndex} className="faq-section">
//             <h2 className="faq-title">{category.title}</h2>
//             <div className="faq-description">
//               <p>
//                 {category.description}{" "}
//                 <a href={category.chatLink} className="chat-link">
//                   Chat to our friendly team
//                 </a>
//                 .
//               </p>
//             </div>
//             <div
//               className={`faq-content ${categoryIndex % 2 === 1 ? "reverse" : ""}`}
//             >
//               {/* FAQ Content */}
//               <div className="faq-text-content">
//                 <div className="faq-items">
//                   {category.faqs.map((faq, faqIndex) => {
//                     const isOpen = openFaqs[`${categoryIndex}-${faqIndex}`];
//                     return (
//                       <div key={faqIndex} className="faq-item">
//                         <div
//                           className="faq-question-container"
//                           onClick={() => toggleFaq(categoryIndex, faqIndex)}
//                         >
//                           <div className="faq-icon">
//                             <div className="icon-circle">
//                               {getIcon(faq.icon)}
//                             </div>
//                           </div>
//                           <div className="faq-content-text">
//                             <h3 className="faq-question-two">{faq.question}</h3>
//                             <p className="faq-answer-two">{faq.answer}</p>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Image */}
//               <div className="faq-image-container">
//                 <div className="image-wrapper-two">
//                   <img
//                     src={category.image}
//                     alt={`${category.title} illustration`}
//                     className="faq-image"
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>
//         ))}
//       </div>
//       <Footer />
//     </>
//   );
// }

// // Helper function to render different icons
// function getIcon(iconName) {
//   switch (iconName) {
//     case "heart":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "refresh":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "block":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "document":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "card":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
//           <path
//             fillRule="evenodd"
//             d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "calendar":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "key":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "users":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//         </svg>
//       );
//     case "data":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
//           <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
//           <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
//         </svg>
//       );
//     case "device":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     case "globe":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//     default:
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
//             clipRule="evenodd"
//           />
//         </svg>
//       );
//   }
// }
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import "./faq.css";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import { client } from "../../sanity/lib/client";
import urlFor from "../helpers/sanity";

export default function FAQ() {
  const [faqData, setFaqData] = useState(null);
  const [openFaqs, setOpenFaqs] = useState({});

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const faqSection = await client.fetch('*[_type == "faqSection"]');
        setFaqData(faqSection);
        console.log(faqSection);
      } catch (err) {
        console.error("Failed to fetch FAQ data:", err);
      }
    };

    fetchFaq();
  }, []);

  const toggleFaq = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!faqData) return <div>Loading FAQs...</div>;

  return (
    <>
      <Header />

      <div className="faq-head">
        <h1>{faqData.title || "Frequently Asked Questions"}</h1>
        <hr />
      </div>

      <div className="faq-container">
        {faqData[0].categories?.map((category, categoryIndex) => (
          <section key={categoryIndex} className="faq-section">
            <h2 className="faq-title">{category.title}</h2>

            <div className="faq-description">
              <p>
                {category.description}{" "}
                <a href={category.chatLink || "/contact"} className="chat-link">
                  Chat to our friendly team
                </a>
                .
              </p>
            </div>

            <div
              className={`faq-content ${categoryIndex % 2 === 1 ? "reverse" : ""}`}
            >
              {/* FAQ Text */}
              <div className="faq-text-content">
                <div className="faq-items">
                  {category.faqs?.map((faq, faqIndex) => {
                    return (
                      <div key={faqIndex} className="faq-item">
                        <div
                          className="faq-question-container"
                          onClick={() => toggleFaq(categoryIndex, faqIndex)}
                        >
                          <div className="faq-icon">
                            <div className="icon-circle">
                              {/* {getIcon(faq.icon)} */}✅
                            </div>
                          </div>
                          <div className="faq-content-text">
                            <h3 className="faq-question-two">{faq.question}</h3>
                            <p className="faq-answer-two">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FAQ Image */}
              <div className="faq-image-container">
                <div className="image-wrapper-two">
                  {category.image && (
                    <Image
                      src={urlFor(category.image).url()}
                      alt={category.title}
                      width={500}
                      height={400}
                      className="faq-image"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </>
  );
}
