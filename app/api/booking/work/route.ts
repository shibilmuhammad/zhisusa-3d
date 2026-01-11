import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      bookingMode,
      workspaceType,
      date,
      members,
      checkInTime,
      checkOutTime,
      checkInDate,
      checkOutDate,
      accommodationType,
      price,
    } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
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

    // Format workspace name
    const getWorkspaceName = (type: string | null) => {
      if (!type) return "N/A";
      const names: Record<string, string> = {
        privateOffice: "Private Office",
        coWorking: "Co-Working Space",
        conferenceRoom: "Conference Room",
      };
      return names[type] || type;
    };

    const getAccommodationName = (type: string | null) => {
      if (!type) return "N/A";
      const names: Record<string, string> = {
        cottages: "Cottages",
        tents: "Luxury Tents",
        villas: "Private Villas",
        treehouses: "Tree Houses",
      };
      return names[type] || type;
    };

    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    const bookingType = bookingMode === "workspace" ? "Workspace Only" : "Work + Stay Package";
    const subject = `New Work Booking - ${bookingType} - ${name}`;

    // Email content
    const mailOptions = {
      from: smtpFrom,
      to: bookingsTo,
      subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0091ff 0%, #4fc3f7 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
              New Work Booking Request
            </h1>
            <p style="color: rgba(255, 255, 255, 0.95); margin: 12px 0 0; font-size: 16px;">
              ZHISUSA Nature Retreat
            </p>
          </div>

          <!-- Booking Type Banner -->
          <div style="background: #f8f9fa; padding: 24px 30px; border-bottom: 3px solid #0091ff;">
            <h2 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 600;">
              ${bookingType}
            </h2>
          </div>

          <!-- Guest Information -->
          <div style="padding: 30px; background: #ffffff;">
            <h3 style="margin: 0 0 20px; color: #333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
              👤 Contact Details
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
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Members:</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${members} ${members === 1 ? "Person" : "People"}</td>
              </tr>
            </table>
          </div>

          <!-- Booking Details -->
          <div style="padding: 30px; background: #f8f9fa;">
            <h3 style="margin: 0 0 20px; color: #333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
              📅 Booking Details
            </h3>
            ${bookingMode === "workspace" ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 12px;">
                <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Workspace</p>
                <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${getWorkspaceName(workspaceType)}</p>
              </div>
              ${date ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 12px;">
                  <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
                  <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${formatDate(date)}</p>
                </div>
              ` : ""}
              ${checkInTime && checkOutTime ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 12px;">
                  <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Time</p>
                  <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${checkInTime} - ${checkOutTime}</p>
                </div>
              ` : ""}
            ` : `
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 12px;">
                <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Accommodation</p>
                <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${getAccommodationName(accommodationType)}</p>
              </div>
              ${checkInDate ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 12px;">
                  <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Check-In</p>
                  <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${formatDate(checkInDate)}</p>
                </div>
              ` : ""}
              ${checkOutDate ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 12px;">
                  <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Check-Out</p>
                  <p style="margin: 8px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${formatDate(checkOutDate)}</p>
                </div>
              ` : ""}
            `}
          </div>

          <!-- Pricing -->
          <div style="padding: 30px; background: #ffffff;">
            <h3 style="margin: 0 0 20px; color: #333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
              💰 Pricing
            </h3>
            <div style="border-top: 2px solid #0091ff; padding-top: 16px;">
              <div style="display: flex; justify-content: space-between; font-size: 22px; font-weight: 700;">
                <span style="color: #1a1a1a;">Total Amount:</span>
                <span style="color: #0091ff;">₹${price.toLocaleString()}</span>
              </div>
            </div>
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
        New Work Booking Request - ZHISUSA
        
        BOOKING TYPE
        ${bookingType}
        
        CONTACT DETAILS
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Members: ${members}
        
        BOOKING DETAILS
        ${bookingMode === "workspace" ? `
          Workspace: ${getWorkspaceName(workspaceType)}
          Date: ${formatDate(date)}
          Time: ${checkInTime || "N/A"} - ${checkOutTime || "N/A"}
        ` : `
          Accommodation: ${getAccommodationName(accommodationType)}
          Check-in: ${formatDate(checkInDate)}
          Check-out: ${formatDate(checkOutDate)}
        `}
        
        PRICING
        Total Amount: ₹${price.toLocaleString()}
        
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


