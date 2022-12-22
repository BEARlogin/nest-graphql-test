-- CreateEnum
CREATE TYPE "TodoType" AS ENUM ('TASK', 'NOTIFICATION');

-- AlterTable
ALTER TABLE "TodoItem" ADD COLUMN     "notificationTime" TIMESTAMP(3),
ADD COLUMN     "type" "TodoType" NOT NULL DEFAULT 'TASK';
