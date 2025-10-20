// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Get the session using the auth handler
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return mock role data - in a real app, we would fetch from DB
    return NextResponse.json({
      user: {
        ...session.user,
        role: "regional_admin", // Default role
        regionCode: "JKT", // Example region code
      }
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}