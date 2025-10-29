/*
  Warnings:

  - You are about to drop the column `stateId` on the `FloorPlan` table. All the data in the column will be lost.
  - Added the required column `regionId` to the `FloorPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."FloorPlan" DROP CONSTRAINT "FloorPlan_stateId_fkey";

-- AlterTable
ALTER TABLE "public"."FloorPlan" DROP COLUMN "stateId",
ADD COLUMN     "regionId" INTEGER;

-- Update existing rows to set regionId
UPDATE "public"."FloorPlan" SET "regionId" = 1 WHERE "regionId" IS NULL;

-- Make regionId NOT NULL
ALTER TABLE "public"."FloorPlan" ALTER COLUMN "regionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."FloorPlan" ADD CONSTRAINT "FloorPlan_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
