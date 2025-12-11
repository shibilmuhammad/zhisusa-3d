import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { checkIn, checkOut } = await request.json();

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;
    const bookingsTo = process.env.BOOKINGS_TO;

    if (!smtpUser || !smtpPass || !smtpFrom || !bookingsTo) {
      return NextResponse.json(
        { error: "Email service is not configured. Please set SMTP env vars." },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT ?? "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Format dates
    const checkInDate = new Date(checkIn).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const checkOutDate = new Date(checkOut).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Calculate nights
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Email content
    const mailOptions = {
      from: smtpFrom,
      to: bookingsTo,
      subject: `New Booking Request - ${checkInDate} to ${checkOutDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00f5c8; margin-bottom: 20px;">New Booking Request - ZHISUSA</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
            <p style="margin: 10px 0;"><strong>Check-in:</strong> ${checkInDate}</p>
            <p style="margin: 10px 0;"><strong>Check-out:</strong> ${checkOutDate}</p>
            <p style="margin: 10px 0;"><strong>Number of Nights:</strong> ${nights}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This booking request was submitted through the ZHISUSA website.
          </p>
        </div>
      `,
      text: `
        New Booking Request - ZHISUSA
        
        Check-in: ${checkInDate}
        Check-out: ${checkOutDate}
        Number of Nights: ${nights}
        
        This booking request was submitted through the ZHISUSA website.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Booking request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending booking email:", error);
    return NextResponse.json(
      { error: "Failed to send booking request" },
      { status: 500 }
    );
  }
}

