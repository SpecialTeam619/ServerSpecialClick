/*
  Warnings:

  - Added the required column `type` to the `Technique` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Technique" ADD COLUMN     "type" TEXT NOT NULL;
