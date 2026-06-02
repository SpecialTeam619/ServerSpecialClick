/*
  Warnings:

  - You are about to drop the column `type` on the `Technique` table. All the data in the column will be lost.
  - Added the required column `techniqueTypeId` to the `Technique` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Technique" DROP COLUMN "type",
ADD COLUMN     "techniqueTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TechniqueType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechniqueType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechniqueType_code_key" ON "TechniqueType"("code");

-- AddForeignKey
ALTER TABLE "Technique" ADD CONSTRAINT "Technique_techniqueTypeId_fkey" FOREIGN KEY ("techniqueTypeId") REFERENCES "TechniqueType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
