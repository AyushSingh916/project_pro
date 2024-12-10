import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

const username = "ayush";

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

console.log(organizations);
