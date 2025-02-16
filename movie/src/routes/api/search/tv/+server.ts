import { lucia } from '$lib/server/auth.js';
import { PrismaClient } from '@prisma/client';
import { TMDBTVSearchResponse } from '$lib/server/tmdb.js';

const prisma = new PrismaClient();

export async function GET({ request, url }) {
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

    const query = url.searchParams.get('q');
    const page = url.searchParams.get('page') || '1';

    const searchResults : TMDBTVSearchResponse = await (await fetch("https://api.themoviedb.org/3/search/tv?api_key=" + process.env.TMDB_API_KEY + "&query=" + query + "&page=" + page)).json();

    return new Response(JSON.stringify({ error: false, results: searchResults.results }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}