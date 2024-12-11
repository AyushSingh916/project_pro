import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { username, email, organizationSlug } = req;

    // Validate input
    if (!username || !email || !organizationSlug) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the organization exists
    const organization = await db.organization.findUnique({
      where: { slug: organizationSlug },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Check if the user exists
    let user = await db.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await db.user.create({
        data: {
          username,
          email,
          password: "default_password", // Replace with a hashed password in production
        },
      });
    }

    // Check if the user is already a member of the organization
    const isMember = await db.organization.findFirst({
      where: {
        slug: organizationSlug,
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });

    if (isMember) {
      return NextResponse.json(
        { message: "User is already a member of the organization" },
        { status: 400 }
      );
    }

    // Add user to the organization
    await db.organization.update({
      where: { slug: organizationSlug },
      data: {
        users: {
          connect: { id: user.id },
        },
      },
    });

    // Fetch the updated organization to include the newly added user
    const updatedOrganization = await db.organization.findUnique({
      where: { slug: organizationSlug },
      include: {
        users: true, // Include all users in the organization
      },
    });

    return NextResponse.json(
      {
        message: "User added to organization successfully",
        user,
        organization: updatedOrganization,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
