/*
  Warnings:

  - A unique constraint covering the columns `[role_name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "hashed_password" SET DATA TYPE CHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "public"."roles"("role_name");
