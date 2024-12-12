/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_imageUrl_key" ON "User"("imageUrl");
