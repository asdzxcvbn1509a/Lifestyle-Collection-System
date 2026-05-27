-- AlterTable: make passwordHash optional (Google-only accounts have no password)
-- and add the nullable googleId used to link a Google account.
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL,
ADD COLUMN     "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
