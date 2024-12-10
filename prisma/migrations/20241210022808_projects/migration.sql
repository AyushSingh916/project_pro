/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `organizationSlug` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organizationId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "organizationId",
ADD COLUMN     "organizationSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationSlug_fkey" FOREIGN KEY ("organizationSlug") REFERENCES "Organization"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
