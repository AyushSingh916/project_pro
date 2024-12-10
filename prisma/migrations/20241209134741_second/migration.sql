/*
  Warnings:

  - A unique constraint covering the columns `[adminUsername]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminUsername` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "adminUsername" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_adminUsername_key" ON "Organization"("adminUsername");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_adminUsername_fkey" FOREIGN KEY ("adminUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
