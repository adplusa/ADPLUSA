import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:4000";

export async function POST(request) {
    try {
        const payload = await request.json();
      const backendResponse = await fetch(`${BACKEND_URL}/api/contact/sync`, {
          method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

      const responseData = await backendResponse.json();
      return NextResponse.json(responseData, { status: backendResponse.status });
  } catch (error) {
      console.error("Contact proxy error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
