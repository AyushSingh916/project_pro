import { db } from "./prisma";
import { Priority, Status } from "@prisma/client";

export async function updateIssueStatusAPI(issueId: string, newStatus: string) {
    const updatedIssue = await db.issue.update({
        where: {
          id: issueId, // Replace issueId with the actual ID of the issue
        },
        data: {
          status: newStatus.toUpperCase() as Status, // Replace newStatus with the desired status value
        },
      });
      console.log(updatedIssue)
}