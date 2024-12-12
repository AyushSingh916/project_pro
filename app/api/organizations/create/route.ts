import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const req = await request.json();

        const { name, slug, description, username } = req;

        const existingOrganization = await db.organization.findUnique({
            where: { slug },
        });

        if (existingOrganization) {
            return NextResponse.json(
                { message: "Organization with this slug already exists." },
                { status: 400 }
            );
        }

        const newOrganization = await db.organization.create({
            data: {
                name,
                slug,
                description,
                adminUsername: username, // Admin is associated by username
                users: {
                    connect: { username }, // Connect the admin user to the organization
                },
            },
        });


        // Return the response
        return NextResponse.json(
            { newOrganization },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating organization:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
