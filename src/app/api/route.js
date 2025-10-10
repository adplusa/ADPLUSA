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
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PRIVATE_KEY, // ✅ private key only
        template_params: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          service: body.service,
          message: body.message,
          submitted_at: body.submitted_at,
          year: body.year,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "EmailJS failed");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SendEmail Error →", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
