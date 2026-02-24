import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:4000";

export async function POST(request) {
    try {
        const payload = await request.json();

        const backendResponse = await fetch(`${BACKEND_URL}/api/contact/sync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const responseData = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json({ error: responseData.error || 'Backend error' }, { status: backendResponse.status });
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error("API Proxy Error:", error);
        return NextResponse.json({ error: 'Internal Server Error in Proxy' }, { status: 500 });
    }
}
