/*
  Warnings:

  - Added the required column `author_id` to the `seo_overrides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seo_overrides" ADD COLUMN     "author_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "seo_overrides" ADD CONSTRAINT "seo_overrides_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
