import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { date, members, activities, name, email, phone } = await request.json();

    if (!date || !members || !activities || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, phone, date, members, and activities are required" },
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

    // Format date
    const bookingDate = new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Format activities list
    const activitiesList = activities
      .map((act: { name: string; startTime: string; endTime: string }) => 
        `• ${act.name} (${act.startTime} - ${act.endTime})`
      )
      .join("<br>");

    // Email content
    const mailOptions = {
      from: smtpFrom,
      to: bookingsTo,
      subject: `New Leisure Booking Request - ${bookingDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3dd598; margin-bottom: 20px;">New Leisure Booking Request - ZHISUSA</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Guest Details</h3>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${bookingDate}</p>
            <p style="margin: 10px 0;"><strong>Number of Members:</strong> ${members}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Selected Activities</h3>
            <div style="margin: 10px 0;">
              ${activitiesList}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This leisure booking request was submitted through the ZHISUSA website.
          </p>
        </div>
      `,
      text: `
        New Leisure Booking Request - ZHISUSA
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        
        Date: ${bookingDate}
        Number of Members: ${members}
        
        Selected Activities:
        ${activities.map((act: { name: string; startTime: string; endTime: string }) => 
          `• ${act.name} (${act.startTime} - ${act.endTime})`
        ).join("\n")}
        
        This leisure booking request was submitted through the ZHISUSA website.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Leisure booking request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending leisure booking email:", error);
    return NextResponse.json(
      { error: "Failed to send booking request" },
      { status: 500 }
    );
  }
}

