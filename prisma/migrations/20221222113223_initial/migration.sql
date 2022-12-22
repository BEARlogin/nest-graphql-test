-- CreateTable
CREATE TABLE "TodoItem" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TodoItem_pkey" PRIMARY KEY ("id")
);
