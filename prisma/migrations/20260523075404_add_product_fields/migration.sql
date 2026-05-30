/*
  Warnings:

  - You are about to drop the column `items` on the `Order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "product" TEXT,
    "quantity" INTEGER,
    "productNote" TEXT,
    "totalValue" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "deliveryDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("clientId", "createdAt", "deliveryDate", "id", "notes", "status", "title", "totalValue", "updatedAt") SELECT "clientId", "createdAt", "deliveryDate", "id", "notes", "status", "title", "totalValue", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
