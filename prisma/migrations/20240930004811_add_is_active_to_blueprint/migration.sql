/*
  Warnings:

  - You are about to drop the column `description` on the `Blueprint` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Blueprint` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Blueprint` table. All the data in the column will be lost.
  - Added the required column `config` to the `Blueprint` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blueprint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Blueprint" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Blueprint";
DROP TABLE "Blueprint";
ALTER TABLE "new_Blueprint" RENAME TO "Blueprint";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
