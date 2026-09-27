import { NextRequest, NextResponse } from "next/server";

const contactRateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous-sender";
    const now = Date.now();
    const rateRecord = contactRateLimit.get(ip);

    if (rateRecord) {
      if (now - rateRecord.timestamp < 60000 && rateRecord.count >= 5) {
        return NextResponse.json(
          { error: "Too many message attempts. Please wait a moment." },
          { status: 429 }
        );
      }
      if (now - rateRecord.timestamp > 60000) {
        contactRateLimit.set(ip, { count: 1, timestamp: now });
      } else {
        rateRecord.count += 1;
      }
    } else {
      contactRateLimit.set(ip, { count: 1, timestamp: now });
    }

    const body = await req.json();
    const { name, email, purpose, message, honeypot } = body;

    // Honeypot check - reject bots silently
    if (honeypot) {
      return NextResponse.json({ success: true, deliveryMode: "configured_service" });
    }

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: "Please provide a valid name (2-100 characters)." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5 || message.trim().length > 1500) {
      return NextResponse.json({ error: "Please provide a message between 5 and 1500 characters." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`
          },
          body: JSON.stringify({
            from: "Portfolio Inquiry <onboarding@resend.dev>",
            to: ["gummadivenkatasaiharishbabu@gmail.com"],
            subject: `[Portfolio Inquiry] ${purpose || "General"} from ${name.trim()}`,
            text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nPurpose: ${purpose}\n\nMessage:\n${message.trim()}`
          })
        });

        if (response.ok) {
          return NextResponse.json({ success: true, deliveryMode: "configured_service" });
        }
      } catch (sendError) {
        console.error("Email dispatch failed:", sendError);
      }
    }

    // Honest fallback mode
    return NextResponse.json({
      success: true,
      deliveryMode: "prepare_fallback",
      message: "No third-party email delivery API key configured. Client mailto link prepared."
    });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error occurred." }, { status: 500 });
  }
}
