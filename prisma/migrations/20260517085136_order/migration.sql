/*
  Warnings:

  - The `status` column on the `Technique` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusTechnique" AS ENUM ('IN_STOCK', 'RENTED');

-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('AWAITING', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Technique" DROP COLUMN "status",
ADD COLUMN     "status" "StatusTechnique" NOT NULL DEFAULT 'IN_STOCK';

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "lessorId" TEXT NOT NULL,
    "status" "StatusOrder" NOT NULL DEFAULT 'AWAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_lessorId_fkey" FOREIGN KEY ("lessorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
