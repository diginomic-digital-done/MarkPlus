/*
  Warnings:

  - The primary key for the `PDFRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `type` on the `VariationOption` table. All the data in the column will be lost.
  - Added the required column `regionId` to the `PDFRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `triggeredBy` on the `PDFRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `variationTypeId` to the `VariationOption` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TriggeredBy" AS ENUM ('USER', 'STAFF', 'SYSTEM');

-- AlterTable
ALTER TABLE "public"."PDFRequest" DROP CONSTRAINT "PDFRequest_pkey",
ADD COLUMN     "regionId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "triggeredBy",
ADD COLUMN     "triggeredBy" "public"."TriggeredBy" NOT NULL,
ADD CONSTRAINT "PDFRequest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PDFRequest_id_seq";

-- AlterTable
ALTER TABLE "public"."VariationOption" DROP COLUMN "type",
ADD COLUMN     "variationTypeId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."VariationType";

-- CreateTable
CREATE TABLE "public"."VariationType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VariationType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VariationType_name_key" ON "public"."VariationType"("name");

-- AddForeignKey
ALTER TABLE "public"."VariationOption" ADD CONSTRAINT "VariationOption_variationTypeId_fkey" FOREIGN KEY ("variationTypeId") REFERENCES "public"."VariationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PDFRequest" ADD CONSTRAINT "PDFRequest_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
