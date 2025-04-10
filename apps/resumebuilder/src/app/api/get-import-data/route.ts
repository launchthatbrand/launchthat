import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// This ensures the route is not statically generated
export const dynamic = "force-dynamic";

// Define the expected shape of resume data
type ResumeData = Record<string, unknown>;

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

    try {
      // attempt to decode and parse the data
      const resumeData = JSON.parse(storedData) as ResumeData;
      return NextResponse.json({ success: true, data: resumeData });
    } catch {
      // If parsing fails, return an error
      return NextResponse.json(
        { error: "Invalid resume data format" },
        { status: 400 },
      );
    }
  } catch {
    // No need to capture the error variable if not used
    return NextResponse.json(
      { error: "Failed to retrieve resume data" },
      { status: 500 },
    );
  }
}
