/*
  Warnings:

  - The `properties` column on the `PostModel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PostModel" DROP COLUMN "properties",
ADD COLUMN     "properties" TEXT[];
