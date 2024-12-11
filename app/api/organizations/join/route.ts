import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, slug } = await request.json();

    console.log(username, slug);

    if (!username || !slug) {
      return NextResponse.json({ error: "Username and slug are required" }, { status: 400 });
    }

    // Fetch the organization along with its admin
    const organization = await db.organization.findUnique({
      where: { slug },
      include: { admin: true },
    });

    console.log(organization);

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const admin = organization.adminUsername;  // Ensure this is the correct admin reference

    // Validate if admin exists
    if (!admin) {
      return NextResponse.json({ error: "Admin not found for this organization" }, { status: 404 });
    }

    // Create the notification
    await db.notification.create({
      data: {
        senderUsername: username, // Connect sender by username
        receiverUsername: admin, // Connect receiver by admin's username
        organizationSlug: slug, // Connect organization by slug
      },
    });

    return NextResponse.json({ message: "Notification created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
      // Extract username from the query string
      const url = new URL(request.url);
      const username = url.searchParams.get("username");
  
      if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
      }
  
      // Fetch the notifications for the given username
      const notifications = await db.notification.findMany({
        where: {
          receiverUsername: username, // Assuming receiverUsername is the column storing the receiver's username
        },
        include: {
          sender: true, // Including sender details (optional)
          organization: true, // Including organization details (optional)
        },
        orderBy: {
          createdAt: "desc", // Order by most recent notifications
        },
      });
  
      // Return notifications in the response
      return NextResponse.json({ notifications }, { status: 200 });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }