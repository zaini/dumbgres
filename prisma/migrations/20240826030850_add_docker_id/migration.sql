/*
  Warnings:

  - Added the required column `dockerId` to the `DatabaseInfo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DatabaseInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dockerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DatabaseInfo" ("createdAt", "id", "name", "password", "port", "updatedAt", "user") SELECT "createdAt", "id", "name", "password", "port", "updatedAt", "user" FROM "DatabaseInfo";
DROP TABLE "DatabaseInfo";
ALTER TABLE "new_DatabaseInfo" RENAME TO "DatabaseInfo";
CREATE UNIQUE INDEX "DatabaseInfo_dockerId_key" ON "DatabaseInfo"("dockerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
