/*
  Warnings:

  - The `is_absent` column on the `volunteers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."volunteers" DROP COLUMN "is_absent",
ADD COLUMN     "is_absent" BOOLEAN NOT NULL DEFAULT false;
