-- CreateTable
CREATE TABLE "RatingGenre" (
    "userId" TEXT NOT NULL,
    "tmdbId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,
    "userRatingUserId" TEXT,
    "userRatingTmdbId" INTEGER,

    PRIMARY KEY ("userId", "tmdbId", "genreId"),
    CONSTRAINT "RatingGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RatingGenre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RatingGenre_userRatingUserId_userRatingTmdbId_fkey" FOREIGN KEY ("userRatingUserId", "userRatingTmdbId") REFERENCES "UserRating" ("userId", "tmdbId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRating" (
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "genreId" INTEGER,

    PRIMARY KEY ("userId", "tmdbId"),
    CONSTRAINT "UserRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRating_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_UserRating" ("rating", "tmdbId", "type", "userId") SELECT "rating", "tmdbId", "type", "userId" FROM "UserRating";
DROP TABLE "UserRating";
ALTER TABLE "new_UserRating" RENAME TO "UserRating";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
