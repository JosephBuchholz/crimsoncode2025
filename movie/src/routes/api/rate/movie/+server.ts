import { json } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth.js';
import { FilmType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
    try {
        const data = await request.json();

        const cookieHeader = request.headers.get("Cookie");
        const sessionId = lucia.readSessionCookie(cookieHeader ?? "");
        if (!sessionId) {
            return new Response(null, {
                status: 401
            });
        }
        const { session, user } = await lucia.validateSession(sessionId);
    
        if (!user) {
            return new Response(null, {
                status: 401
            });
        }

        if (data.watched) {
            const existingRating = await prisma.userRating.findFirst({
                where: {
                    userId: user.id,
                    tmdbId: data.id
                }
            });

            if (existingRating) {
                await prisma.userRating.update({
                    where: {
                        userId_tmdbId: { userId: user.id, tmdbId: data.id }
                    },
                    data: {
                        rating: data.rating
                    }
                });
            } else {   
                await prisma.userRating.create({
                    data: {
                        userId: user.id,
                        tmdbId: data.id,
                        rating: data.rating,
                        type: "movie"
                    }
                });
            }
        } else {
            await prisma.userRating.deleteMany({
                where: {
                    userId: user.id,
                    tmdbId: data.id
                }
            });
        }

        // Cache the genres of our rating
        for (const movieGenre of data.genres) {
            const genres = await prisma.genre.findMany({
                where: {
                    tmdbMovieId: movieGenre.id
                }
            });

            if (genres.length === 0) {
                continue;
            }

            for (const genre of genres) {
                await prisma.ratingGenre.create({
                    data: {
                        userId: user.id,
                        tmdbId: data.id,
                        genreId: genre.id
                    }
                });
            }
        }

        console.log('Received data:', data);
    
        return json({ message: 'Success', received: data }, { status: 201 });
    } catch (error) {
        console.error('Error processing request:', error);
        return json({ message: 'Error', error: error.message }, { status: 500 });
    }
}