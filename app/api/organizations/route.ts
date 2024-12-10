import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { username } = await request.json(); 


        if (!username) {
            return NextResponse.json({ message: "Username is missing" }, { status: 400 });
        }

        // Fetch organizations where the current user is either the admin or has joined
        const organizations = await db.organization.findMany({
            where: {
              OR: [
                { adminUsername: username },
                {
                  users: {
                    some: {
                      username: username
                    }
                  }
                }
              ]
            },
            include: {
              admin: {
                select: {
                  username: true,
                  email: true
                }
              },
              users: {
                select: {
                  username: true,
                  email: true
                }
              }
            }
          });

        return NextResponse.json({ organizations }, { status: 200 });
    } catch (error) {
        console.error("Error fetching organizations:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
