/*
  Warnings:

  - The `is_verified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_active` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."news" ALTER COLUMN "image_url" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."refresh_tokens" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."roles" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "is_verified",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "gdpr_accepted_at" DROP NOT NULL,
ALTER COLUMN "gdpr_accepted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."volunteers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT;
