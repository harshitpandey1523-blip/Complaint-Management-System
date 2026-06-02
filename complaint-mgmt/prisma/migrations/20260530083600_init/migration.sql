-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderId" TEXT,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "resolvedAt" DATETIME,
    "customerId" TEXT NOT NULL,
    "assignedToId" TEXT,
    CONSTRAINT "Complaint_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Complaint_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "complaintId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Comment_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "Complaint_priority_idx" ON "Complaint"("priority");

-- CreateIndex
CREATE INDEX "Complaint_category_idx" ON "Complaint"("category");

-- CreateIndex
CREATE INDEX "Complaint_customerId_idx" ON "Complaint"("customerId");

-- CreateIndex
CREATE INDEX "Complaint_assignedToId_idx" ON "Complaint"("assignedToId");

-- CreateIndex
CREATE INDEX "Comment_complaintId_idx" ON "Comment"("complaintId");
