-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_seo_override_id_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "seo_override_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_override_id_fkey" FOREIGN KEY ("seo_override_id") REFERENCES "seo_overrides"("id") ON DELETE SET NULL ON UPDATE CASCADE;
