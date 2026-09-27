import { NextRequest, NextResponse } from "next/server";
import { getStudioSessionFromRequest } from "@/lib/studio-auth.server";

export async function GET(req: NextRequest) {
  const session = getStudioSessionFromRequest(req);

  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: "No active authenticated session found." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email || "gummadivenkatasaiharishbabu@gmail.com"
    }
  });
}
