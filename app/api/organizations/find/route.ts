import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  const req = await request.json();
  const slug = req.slug;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ message: "Slug is not there" }, { status: 404 });
  }

  try {
    const organization = await db.organization.findUnique({
      where: { slug },
      include: {
        admin: {
          select: { username: true, email: true },
        },
        users: {
          select: { username: true, email: true },
        },
        projects: true,
      },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        admin: organization.admin,
        users: organization.users,
        projects: organization.projects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
