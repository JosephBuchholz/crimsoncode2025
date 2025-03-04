-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserRating" (
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "genreId" INTEGER,

    PRIMARY KEY ("userId", "tmdbId", "type"),
    CONSTRAINT "UserRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRating_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RatingGenre" (
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,
    "userRatingUserId" TEXT,
    "userRatingTmdbId" INTEGER,
    "userRatingType" TEXT,

    PRIMARY KEY ("userId", "tmdbId", "genreId", "type"),
    CONSTRAINT "RatingGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RatingGenre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RatingGenre_userRatingUserId_userRatingTmdbId_userRatingType_fkey" FOREIGN KEY ("userRatingUserId", "userRatingTmdbId", "userRatingType") REFERENCES "UserRating" ("userId", "tmdbId", "type") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserGenre" (
    "userId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "genreId"),
    CONSTRAINT "UserGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserGenre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tmdbMovieId" INTEGER NOT NULL,
    "tmdbTvId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
