/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `organizationSlug` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverUsername` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderUsername` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_senderId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "organizationId",
DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "organizationSlug" TEXT NOT NULL,
ADD COLUMN     "receiverUsername" TEXT NOT NULL,
ADD COLUMN     "senderUsername" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderUsername_fkey" FOREIGN KEY ("senderUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverUsername_fkey" FOREIGN KEY ("receiverUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_organizationSlug_fkey" FOREIGN KEY ("organizationSlug") REFERENCES "Organization"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
