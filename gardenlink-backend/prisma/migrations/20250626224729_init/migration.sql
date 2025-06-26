/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_GardenerProfileToServiceCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `GardenerProfile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GARDENER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "_GardenerProfileToServiceCategory" DROP CONSTRAINT "_GardenerProfileToServiceCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_GardenerProfileToServiceCategory" DROP CONSTRAINT "_GardenerProfileToServiceCategory_B_fkey";

-- AlterTable
ALTER TABLE "GardenerProfile" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'GARDENER';

-- DropTable
DROP TABLE "_GardenerProfileToServiceCategory";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfileServices_B_index" ON "_ProfileServices"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "GardenerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileServices" ADD CONSTRAINT "_ProfileServices_A_fkey" FOREIGN KEY ("A") REFERENCES "GardenerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileServices" ADD CONSTRAINT "_ProfileServices_B_fkey" FOREIGN KEY ("B") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
