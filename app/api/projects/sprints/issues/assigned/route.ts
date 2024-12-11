import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const username = url.searchParams.get('username') || "";

    const fetchedIssues = await db.issue.findMany({
        where: {
            assigneeUsername: username
        },
        include: {
            sprint: {
                include: {
                    project: true 
                }
            }
        }
    });
    
    return NextResponse.json(fetchedIssues, { status: 201 });
}
