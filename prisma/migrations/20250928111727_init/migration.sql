/*
  Warnings:

  - You are about to drop the column `sport` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `sport` on the `Player` table. All the data in the column will be lost.
  - Added the required column `sportId` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sportId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sportId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."League" DROP COLUMN "sport",
ADD COLUMN     "sportId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Player" DROP COLUMN "sport",
ADD COLUMN     "sportId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "sportId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Sport";

-- CreateTable
CREATE TABLE "public"."Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."League" ADD CONSTRAINT "League_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
