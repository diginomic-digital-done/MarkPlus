/*
  Warnings:

  - You are about to rename the `VariationType` table to `Zone`.
  - You are about to rename the `VariationOption` table to `Variation`.
  - You are about to rename the `variationTypeId` column on the `Variation` table to `zoneId`.

*/

-- Drop existing foreign key constraint
ALTER TABLE "public"."VariationOption" DROP CONSTRAINT "VariationOption_variationTypeId_fkey";

-- Rename VariationType table to Zone
ALTER TABLE "public"."VariationType" RENAME TO "Zone";

-- Rename VariationOption table to Variation
ALTER TABLE "public"."VariationOption" RENAME TO "Variation";

-- Rename variationTypeId column to zoneId
ALTER TABLE "public"."Variation" RENAME COLUMN "variationTypeId" TO "zoneId";

-- Update foreign key constraints with new names
ALTER TABLE "public"."Variation" ADD CONSTRAINT "Variation_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Rename primary key constraints
ALTER INDEX "VariationType_pkey" RENAME TO "Zone_pkey";
ALTER INDEX "VariationOption_pkey" RENAME TO "Variation_pkey";

-- Rename unique constraint
ALTER INDEX "VariationType_name_key" RENAME TO "Zone_name_key";
