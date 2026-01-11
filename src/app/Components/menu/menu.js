// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import "./menu.css";
// import Link from "next/link";
// import { useGSAP } from "@gsap/react";
// import { gsap } from "gsap";
// import Image from "next/image";

// const menuLinks = [
//   { path: "/projects", label: "Projects" },
//   { path: "/work", label: "Work" },
//   { path: "/about", label: "About" },
//   { path: "/team", label: "Team" },
//   { path: "/contact", label: "Contact" },
// ];

// const Menu = () => {
//   const container = useRef();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [logo, setLogo] = useState("/flip-one-bg.png");

//   const tl = useRef();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   useGSAP(
//     () => {
//       gsap.set(".menu-link-item-holder", { y: 75 });

//       tl.current = gsap
//         .timeline({ paused: true })
//         .to(".menu-overlay", {
//           duration: 1.25,
//           clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//           ease: "power4.inOut",
//         })
//         .to(".menu-link-item-holder", {
//           y: 0,
//           duration: 1,
//           stagger: 0.1,
//           ease: "power4.inOut",
//           delay: -0.75,
//         });
//     },
//     { scope: container }
//   );

//   useEffect(() => {
//     if (isMenuOpen) {
//       tl.current.play();
//     } else {
//       tl.current.reverse();
//     }
//   }, [isMenuOpen]);

//   useEffect(() => {
//     const updateLogo = () => {
//       setLogo(
//         document.body.classList.contains("dark-mode")
//           ? "/flip-oneee.png"
//           : "/flip-one.jpg"
//       );
//     };

//     // Run on mount
//     updateLogo();

//     // Observe for changes
//     const observer = new MutationObserver(() => {
//       updateLogo();
//     });

//     observer.observe(document.body, { attributes: true });

//     return () => observer.disconnect(); // Cleanup observer
//   }, []);

//   return (
//     <div className="menu-container" ref={container}>
//       <div className="menu-bar">
//         <div className="menu-open" onClick={toggleMenu}>
//           <p>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               fill="currentColor"
//               className="bi bi-list"
//               viewBox="0 0 16 16"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
//               />
//             </svg>
//           </p>
//         </div>
//       </div>
//       <div className="menu-overlay">
//         <div className="menu-overlay-bar">
//           <div className="menu-logo">
//             <div className="flip-logo">
//               <span className="flip-container">
//                 <Image
//                   id="flip-one"
//                   className="flip-front"
//                   src="/flip-one-bg.png"
//                   //   src={logo}
//                   alt="logo"
//                   width={100}
//                   height={100}
//                   unoptimized
//                 />
//                 <Image
//                   id="flip-two"
//                   className="flip-back"
//                   src={"/flip-two.png"}
//                   alt="logo"
//                   width={100}
//                   height={100}
//                   unoptimized
//                 />
//               </span>
//             </div>
//           </div>
//           <div className="menu-close" onClick={toggleMenu}>
//             <p>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 fill="currentColor"
//                 className="bi bi-x-lg"
//                 viewBox="0 0 16 16"
//               >
//                 <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
//               </svg>
//             </p>
//           </div>
//         </div>

//         <div className="menu-copy">
//           <div className="menu-links">
//             {menuLinks.map((link, index) => (
//               <div className="menu-link-item" key={index}>
//                 <div className="menu-link-item-holder" onClick={toggleMenu}>
//                   <Link href={link.path} className="menu-link">
//                     {link.label}
//                   </Link>
//                 </div>
//                 <hr id="mega-menu-line" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Menu;
