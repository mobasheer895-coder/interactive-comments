/*
  Warnings:

  - A unique constraint covering the columns `[userId,replyId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "replyId" INTEGER,
ALTER COLUMN "commentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_replyId_key" ON "Vote"("userId", "replyId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
