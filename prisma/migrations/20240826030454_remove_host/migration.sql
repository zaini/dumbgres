/*
  Warnings:

  - You are about to drop the column `host` on the `DatabaseInfo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DatabaseInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
