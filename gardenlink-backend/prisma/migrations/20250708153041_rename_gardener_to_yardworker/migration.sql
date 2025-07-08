/*
  Warnings:

  - The values [GARDENER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `GardenerProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('YARD_WORKER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'YARD_WORKER';
COMMIT;

-- DropForeignKey
ALTER TABLE "GardenerProfile" DROP CONSTRAINT "GardenerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_profileId_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileServices" DROP CONSTRAINT "_ProfileServices_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileServices" DROP CONSTRAINT "_ProfileServices_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'YARD_WORKER';

-- DropTable
DROP TABLE "GardenerProfile";

-- CreateTable
CREATE TABLE "YardWorkerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photo" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YardWorkerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YardWorkerProfile_userId_key" ON "YardWorkerProfile"("userId");

-- AddForeignKey
ALTER TABLE "YardWorkerProfile" ADD CONSTRAINT "YardWorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "YardWorkerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileServices" ADD CONSTRAINT "_ProfileServices_A_fkey" FOREIGN KEY ("A") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileServices" ADD CONSTRAINT "_ProfileServices_B_fkey" FOREIGN KEY ("B") REFERENCES "YardWorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
