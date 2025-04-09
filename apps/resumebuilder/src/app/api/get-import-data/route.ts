import { NextRequest, NextResponse } from "next/server";

import { ResumeDataPayload } from "../receive-data/route";
import { cookies } from "next/headers";

// This ensures the route is not statically generated
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the request
    const searchParams = request.nextUrl.searchParams;
    const token = await Promise.resolve(searchParams.get("token"));

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Get the stored token and data from cookies
    const storedToken = cookies().get("resume_token")?.value;
    const storedData = cookies().get("resume_data")?.value;

    // Verify the token matches
    if (!storedToken || storedToken !== token) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Parse the stored data
    if (!storedData) {
      return NextResponse.json(
        { error: "No resume data found" },
        { status: 404 },
      );
    }

    let resumeData: ResumeDataPayload;
    try {
      resumeData = JSON.parse(storedData) as ResumeDataPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid resume data format" },
        { status: 400 },
      );
    }

    // Clear the cookies after retrieving the data
    cookies().set("resume_token", "", {
      maxAge: 0,
      path: "/",
    });

    cookies().set("resume_data", "", {
      maxAge: 0,
      path: "/",
    });

    // Return the resume data
    return NextResponse.json({ resumeData });
  } catch (error) {
    console.error("Error retrieving resume data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve resume data" },
      { status: 500 },
    );
  }
}
