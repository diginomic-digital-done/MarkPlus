/*
  Warnings:

  - Added the required column `stateId` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."FloorPlan" DROP CONSTRAINT "FloorPlan_regionId_fkey";

-- AlterTable
ALTER TABLE "public"."Region" ADD COLUMN "stateId" INTEGER;

-- Set a default stateId for existing regions (update as needed)
UPDATE "public"."Region" SET "stateId" = 1 WHERE "stateId" IS NULL;

-- Make stateId NOT NULL
ALTER TABLE "public"."Region" ALTER COLUMN "stateId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Region" ADD CONSTRAINT "Region_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FloorPlan" ADD CONSTRAINT "FloorPlan_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
