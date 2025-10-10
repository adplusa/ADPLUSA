// import { NextResponse } from "next/server";
// import { createClient } from "@sanity/client";

// // Setup Sanity write client (server-side only)
// const writeClient = process.env.SANITY_API_TOKEN
//   ? createClient({
//       projectId:
//         process.env.SANITY_PROJECT_ID ||
//         process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//       dataset:
//         process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
//       apiVersion: "2024-05-01",
//       token: process.env.SANITY_API_TOKEN, // secure server token
//       useCdn: false,
//     })
//   : null;

// export async function POST(req) {
//   try {
//     const data = await req.json();
//     // {name,email,phone,service,message,submitted_at,year}

//     // 1) Send email via EmailJS REST API
//     const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         service_id: process.env.EMAILJS_SERVICE_ID,
//         template_id: process.env.EMAILJS_TEMPLATE_ID,
//         user_id: process.env.EMAILJS_PUBLIC_KEY, // public key
//         template_params: data,
//       }),
//     });

//     if (!r.ok) {
//       const t = await r.text();
//       throw new Error(t || "EmailJS error");
//     }

//     // 2) Optional: also store to Sanity
//     if (writeClient) {
//       await writeClient.create({
//         _type: "enquiry",
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         service: data.service || "",
//         message: data.message || "",
//         submitted_at: data.submitted_at,
//         year: data.year,
//         createdAt: new Date().toISOString(),
//       });
//     }

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     return NextResponse.json(
//       { ok: false, error: err?.message || "Send failed" },
//       { status: 500 }
//     );
//   }
// }

// console.log("naveen");

// app/api/sendEmail/route.js
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

// ----------------------
// 🔐 1. Secure Sanity Write Client (server-side only)
// ----------------------
const writeClient =
  process.env.SANITY_API_TOKEN &&
  createClient({
    projectId:
      process.env.SANITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset:
      process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-05-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

// ----------------------
// 📩 2. POST Handler — Email + DB store
// ----------------------
export async function POST(req) {
  try {
    const data = await req.json();
    // Expected fields: { name, email, phone, service, message, submitted_at, year }

    // ----------------------
    // 2A. Send email via EmailJS (server-side)
    // ----------------------
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,

        // ✅ Use PRIVATE KEY (not public key)
        private_key: process.env.EMAILJS_PRIVATE_KEY,

        template_params: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service || "General",
          message: data.message || "",
          submitted_at:
            data.submitted_at ||
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          year: data.year || new Date().getFullYear(),
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "EmailJS failed");
    }

    // ----------------------
    // 2B. Store enquiry in Sanity (optional)
    // ----------------------
    if (writeClient) {
      await writeClient.create({
        _type: "enquiry",
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service || "",
        message: data.message || "",
        submitted_at:
          data.submitted_at ||
          new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        year: data.year || new Date().getFullYear(),
        createdAt: new Date().toISOString(),
      });
    }

    // ----------------------
    // 2C. Respond success
    // ----------------------
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SendEmail API Error →", err);
    return NextResponse.json(
      { success: false, error: err.message || "Send failed" },
      { status: 500 }
    );
  }
}
