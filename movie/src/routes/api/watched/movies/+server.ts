import { lucia } from '$lib/server/auth.js';
import { PrismaClient } from '@prisma/client';
import type { TMDBMovieDetailsItem } from '$lib/server/tmdb.js';

const prisma = new PrismaClient();

type RatedMovie = {
    item: TMDBMovieDetailsItem;
    rating: string;
}

export async function GET({ request }) {
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

    console.log("User " + user.id + " (" + user.name + ") wants their ratings list!");

    const ratings = await prisma.userRating.findMany({
        where: {
            userId: user.id
        }
    });

    const watched : RatedMovie[] = [];
    for (const rating of ratings) {
        const response = await fetch(
            'https://api.themoviedb.org/3/movie/' + rating.tmdbId + '?api_key=' + process.env.TMDB_API_KEY
        );
        if (response.status === 200) {
            const data: TMDBMovieDetailsItem = await response.json();
            watched.push({ item: data, rating: rating.rating });
        }
    }
     
    return new Response(JSON.stringify({ error: false, watched: watched }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}