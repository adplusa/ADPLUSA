// "use client";

// import { useEffect } from "react";
// import Lenis from "@studio-freight/lenis";

// export default function LenisScroll() {
//   useEffect(() => {
//     const lenis = new Lenis({
//       duration: 1,
//       smooth: true,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // optional custom easing
//     });

//     function raf(time) {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     }

//     requestAnimationFrame(raf);

//     return () => lenis.destroy();
//   }, []);

//   return null;
// }
"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function LenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      smoothTouch: true, // ✅ enable for touch devices
      touchMultiplier: 1.5, // ✅ make touch more responsive
      direction: "vertical",
      gestureDirection: "vertical",
      lerp: 0.1,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return null;
}
