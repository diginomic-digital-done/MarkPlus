/*
  Warnings:

  - Changed the type of `type` on the `VariationOption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."VariationType" AS ENUM ('COLOR', 'LAYOUT', 'UPGRADE');

-- AlterTable
ALTER TABLE "public"."VariationOption" DROP COLUMN "type",
ADD COLUMN     "type" "public"."VariationType" NOT NULL;
