import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    await prisma.genre.create({
        data: {
          id: 0,
          name: "Action",
          tmdbMovieId: 28,
          tmdbTvId: 10759,
        },
      });
    await prisma.genre.create({
        data: {
          id: 1,
          name: "Adventure",
          tmdbMovieId: 12,
          tmdbTvId: 10759,
        },
      });
    await prisma.genre.create({
        data: {
          id: 2,
          name: "Animation",
          tmdbMovieId: 16,
          tmdbTvId: 16,
        },
      });
    await prisma.genre.create({
        data: {
          id: 3,
          name: "Comedy",
          tmdbMovieId: 35,
          tmdbTvId: 35,
        },
      });
    await prisma.genre.create({
        data: {
          id: 4,
          name: "Crime",
          tmdbMovieId: 80,
          tmdbTvId: 80,
        },
      });
      await prisma.genre.create({
        data: {
          id: 5,
          name: "Documentary",
          tmdbMovieId: 99,
          tmdbTvId: 99,
        },
      });
      await prisma.genre.create({
        data: {
          id: 6,
          name: "Drama",
          tmdbMovieId: 18,
          tmdbTvId: 18,
        },
      });
      await prisma.genre.create({
        data: {
          id: 7,
          name: "Family",
          tmdbMovieId: 10751,
          tmdbTvId: 10751,
        },
      });
      await prisma.genre.create({
        data: {
          id: 8,
          name: "Fantasy",
          tmdbMovieId: 14,
          tmdbTvId: 10764,
        },
      });
      await prisma.genre.create({
        data: {
          id: 9,
          name: "History",
          tmdbMovieId: 36,
          tmdbTvId: 10768,
        },
      });
      await prisma.genre.create({
        data: {
          id: 10,
          name: "Horror",
          tmdbMovieId: 27,
          tmdbTvId: 9648,
        },
      });
      await prisma.genre.create({
        data: {
          id: 11,
          name: "Music",
          tmdbMovieId: 10402,
          tmdbTvId: 10767,
        },
      });
      await prisma.genre.create({
        data: {
          id: 12,
          name: "Mystery",
          tmdbMovieId: 9648,
          tmdbTvId: 9648,
        },
      });
      await prisma.genre.create({
        data: {
          id: 13,
          name: "Romance",
          tmdbMovieId: 10749,
          tmdbTvId: 10764,
        },
      });
      await prisma.genre.create({
        data: {
          id: 14,
          name: "Sci-Fi",
          tmdbMovieId: 878,
          tmdbTvId: 10765,
        },
      });
      await prisma.genre.create({
        data: {
          id: 15,
          name: "Thriller",
          tmdbMovieId: 53,
          tmdbTvId: 10759,
        },
      });
      await prisma.genre.create({
        data: {
          id: 16,
          name: "War",
          tmdbMovieId: 10752,
          tmdbTvId: 10768,
        },
      });
      await prisma.genre.create({
        data: {
          id: 17,
          name: "Western",
          tmdbMovieId: 37,
          tmdbTvId: 37,
        },
      });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })