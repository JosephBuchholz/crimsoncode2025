import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TMDBTVDetailsItem } from '$lib/server/tmdb.js';
import { PrismaClient } from '@prisma/client';
import { lucia } from '$lib/server/auth';
import TVShow from '$lib/TVShow';

const prisma = new PrismaClient();

export const load: PageLoad = async ({ params, cookies }) => {
	const sessionCookie = cookies.get('auth_session');
	const { session, user } = await lucia.validateSession(sessionCookie);
	if (!user) throw error(401, 'Unauthorized');

	const response = await fetch(
		'https://api.themoviedb.org/3/tv/' + params.slug + '?api_key=' + process.env.TMDB_API_KEY
	);

	if (response.status === 200) {
		const tvShowItem: TMDBTVDetailsItem = await response.json();
		const show = TVShow.constructFromTVServerData(tvShowItem);

		const userRating = await prisma.userRating.findFirst({
			where: {
				userId: user.id,
				tmdbId: show.id
			}
		});

		let watched = false;
		let rating = 0;
		if (userRating) {
			watched = true;
			rating = userRating.rating == 'unrated' ? 0 : userRating.rating == 'positive' ? 1 : 2;
		}

		return {
			show: {
				id: show.id,
				name: show.name,
				description: show.description,
				imageUrl: show.imageUrl,
				year: show.year,
				genres: show.genres
			},
			serverWatched: watched,
			serverRating: rating
		};
	} else {
		return error(404, 'TV show not found');
	}
};
