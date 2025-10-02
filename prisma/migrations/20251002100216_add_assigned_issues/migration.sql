-- AlterTable
ALTER TABLE "public"."Issue" ADD COLUMN     "assignedToUserId" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
