-- CreateTable
CREATE TABLE "PostModel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "properties" TEXT NOT NULL,

    CONSTRAINT "PostModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostModel" ADD CONSTRAINT "PostModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
