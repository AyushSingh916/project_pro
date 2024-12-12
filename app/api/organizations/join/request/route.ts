import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { requestId, action, senderUsername, organizationSlug } = await request.json();

    if (!requestId || !action || !senderUsername || !organizationSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (action === "approve") {
      // Add the user to the organization
      await db.organization.update({
        where: { slug: organizationSlug },
        data: {
          users: {
            connect: { username: senderUsername },
          },
        },
      });

      // Optionally, create a notification for the sender
      await db.notification.delete({
        where: {
          id: requestId
        },
      });

      return NextResponse.json({ message: "User approved and added to the organization" }, { status: 200 });
    } else if (action === "cancel") {
      // Logic for canceling the request, e.g., removing a pending notification
      await db.notification.delete({
        where: { id: requestId },
      });

      return NextResponse.json({ message: "Join request canceled" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error handling join request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
