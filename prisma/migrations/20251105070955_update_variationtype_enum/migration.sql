/*
  Warnings:

  - The values [COLOR,LAYOUT,UPGRADE] on the enum `VariationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."VariationType_new" AS ENUM ('ELEVATION', 'LIVING_AREA', 'MASTER_SUITE', 'FAMILY_WING');
ALTER TABLE "public"."VariationOption" ALTER COLUMN "type" TYPE "public"."VariationType_new" USING ("type"::text::"public"."VariationType_new");
ALTER TYPE "public"."VariationType" RENAME TO "VariationType_old";
ALTER TYPE "public"."VariationType_new" RENAME TO "VariationType";
DROP TYPE "public"."VariationType_old";
COMMIT;
