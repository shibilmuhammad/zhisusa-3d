import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      stayType,
      stayName,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight,
      totalPrice,
    } = await request.json();

    if (!name || !email || !phone || !checkIn || !checkOut || !stayType) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Email content
    const mailOptions = {
      from: smtpFrom,
      to: bookingsTo,
      subject: `New Live Booking - ${stayName} - ${checkInDate}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ff8a50 0%, #ffb380 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
              New Live Booking Request
            </h1>
            <p style="color: rgba(255, 255, 255, 0.95); margin: 12px 0 0; font-size: 16px;">
              ZHISUSA Nature Retreat
            </p>
          </div>

          <!-- Accommodation Type Banner -->
          <div style="background: #f8f9fa; padding: 24px 30px; border-bottom: 3px solid #ff8a50;">
            <h2 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 600;">
              ${stayName}
            </h2>
            <p style="margin: 8px 0 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              ${stayType}
            </p>
          </div>

          <!-- Guest Information -->
          <div style="padding: 30px; background: #ffffff;">
            <h3 style="margin: 0 0 20px; color: #333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
              👤 Guest Details
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px; width: 140px;">Full Name:</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${name}</td>
              </tr>
              <tr style="background: #fafafa;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Email:</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Phone:</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${phone}</td>
              </tr>
              <tr style="background: #fafafa;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Guests:</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${guests} Guest${guests > 1 ? 's' : ''}</td>
              </tr>
            </table>
          </div>

          <!-- Booking Dates -->
          <div style="padding: 30px; background: #f8f9fa;">
            <h3 style="margin: 0 0 20px; color: #333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
              📅 Stay Details
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3dd598;">
                <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Check-In</p>
                <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${checkInDate}</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b9d;">
                <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Check-Out</p>
                <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${checkOutDate}</p>
              </div>
            </div>
            <div style="margin-top: 20px; background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px dashed #ff8a50;">
              <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Duration</p>
              <p style="margin: 8px 0 0; color: #ff8a50; font-size: 24px; font-weight: 700;">${nights} Night${nights > 1 ? 's' : ''}</p>
            </div>
          </div>

          <!-- Pricing -->
          <div style="padding: 30px; background: #ffffff;">
            <h3 style="margin: 0 0 20px; color: #333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
              💰 Pricing Summary
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 15px;">Rate per Night:</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right;">₹${pricePerNight.toLocaleString()}</td>
              </tr>
              <tr style="background: #fafafa;">
                <td style="padding: 12px 0; color: #666; font-size: 15px;">Number of Nights:</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right;">× ${nights}</td>
              </tr>
              <tr style="border-top: 2px solid #ff8a50;">
                <td style="padding: 16px 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">Total Amount:</td>
                <td style="padding: 16px 0; color: #ff8a50; font-size: 22px; font-weight: 700; text-align: right;">₹${totalPrice.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <!-- Additional Info -->
          <div style="padding: 30px; background: #f0f7ff; border-top: 3px solid #0091ff;">
            <h4 style="margin: 0 0 12px; color: #0091ff; font-size: 16px; font-weight: 600;">
              ℹ️ Additional Information
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
              <li>Breakfast included for all guests</li>
              <li>Free cancellation up to 48 hours before check-in</li>
              <li>Please confirm availability and respond to guest</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="padding: 24px 30px; background: #1a1a1a; text-align: center;">
            <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 13px;">
              This booking request was submitted through the ZHISUSA website
            </p>
            <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.5); font-size: 12px;">
              © ${new Date().getFullYear()} ZHISUSA Nature Retreat. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        New Live Booking Request - ZHISUSA
        
        ACCOMMODATION
        ${stayName} (${stayType})
        
        GUEST DETAILS
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Guests: ${guests}
        
        STAY DETAILS
        Check-in: ${checkInDate}
        Check-out: ${checkOutDate}
        Duration: ${nights} night${nights > 1 ? 's' : ''}
        
        PRICING
        Rate per Night: ₹${pricePerNight.toLocaleString()}
        Number of Nights: ${nights}
        Total Amount: ₹${totalPrice.toLocaleString()}
        
        ADDITIONAL INFO
        - Breakfast included for all guests
        - Free cancellation up to 48 hours before check-in
        - Please confirm availability and respond to guest
        
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

