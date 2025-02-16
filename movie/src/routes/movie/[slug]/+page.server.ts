import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Movie from '$lib/Movie';
import type { TMDBMovieDetailsItem } from '$lib/server/tmdb.js';
import { PrismaClient } from '@prisma/client';
import { lucia } from '$lib/server/auth';

const prisma = new PrismaClient();

export const load: PageLoad = async ({ params, cookies }) => {
	const sessionCookie = cookies.get('auth_session');
	const { session, user } = await lucia.validateSession(sessionCookie);
	if (!user) throw error(401, 'Unauthorized');

	const response = await fetch(
		'https://api.themoviedb.org/3/movie/' + params.slug + '?api_key=' + process.env.TMDB_API_KEY
	);

	if (response.status === 200) {
		const movieItem: TMDBMovieDetailsItem = await response.json();
		const movie = Movie.constructFromServerData(movieItem);

		const userRating = await prisma.userRating.findFirst({
			where: {
				userId: user.id,
				tmdbId: movie.id
			}
		});

		let watched = false;
		let rating = 0;
		if (userRating) {
			watched = true;
			rating = userRating.rating == 'unrated' ? 0 : (userRating.rating == 'positive' ? 1 : 2);
		}

		return {
			movie: {
				id: movie.id,
				title: movie.title,
				description: movie.description,
				imageUrl: movie.imageUrl,
				year: movie.year,
				length: movie.length,
				genres: movie.genres
			},
			serverWatched: watched,
			serverRating: rating
		};
	} else {
		return error(404, 'Movie not found');
	}
};
