import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

// Define shape of the incoming data
export interface ResumeDataPayload {
  personalInfo?: {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    summary?: string;
    profileImage?: string;
  };
  workExperience?: {
    id: string;
    value: string;
  }[];
  education?: {
    id: string;
    value: string;
  }[];
  skills?: {
    id: string;
    value: string;
  }[];
  template?: string;
  customSections?: Record<
    string,
    {
      title: string;
      items: {
        id: string;
        value: string;
      }[];
    }
  >;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const data = (await request.json()) as ResumeDataPayload;

    // Check if data has valid structure
    if (typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    // Generate a unique session token for this data
    const sessionToken = crypto.randomUUID();

    // Store the data in an encrypted cookie with 10-minute expiration
    // This is more secure than storing in plain localStorage
    cookies().set("resume_data", JSON.stringify(data), {
      httpOnly: true,
      secure: true,
      maxAge: 600, // 10 minutes in seconds
      path: "/",
    });

    cookies().set("resume_token", sessionToken, {
      httpOnly: true,
      secure: true,
      maxAge: 600, // 10 minutes in seconds
      path: "/",
    });

    // Return success with the session token and redirect URL
    return NextResponse.json({
      success: true,
      token: sessionToken,
      redirectUrl: `/import?token=${sessionToken}`,
    });
  } catch (error) {
    console.error("Error processing resume data:", error);
    return NextResponse.json(
      { error: "Failed to process resume data" },
      { status: 500 },
    );
  }
}
