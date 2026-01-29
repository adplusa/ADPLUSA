import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const payload = await request.json();

        const backendResponse = await fetch("http://localhost:4000/api/contact/sync", {
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
