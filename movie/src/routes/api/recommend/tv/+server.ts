import { lucia } from '$lib/server/auth'; // Assuming you have a custom utility to get the session
import { PrismaClient } from '@prisma/client';
import type {
	TMDBTVDetailsItem,
	TMDBTVSearchItem,
	TMDBTrendingTVResponse
} from '$lib/server/tmdb.js';

const prisma = new PrismaClient();

async function fillRemainingRecommendations(
	recommendations: TMDBTVDetailsItem[],
	tmdbGenreIds: number[]
) {
	console.log('Filling remaining recommendations...');

	// Fetch trending shows from TMDB API, filling the recommendations up to 20
	let page = 1;
	let results: TMDBTVSearchItem[] | null = null;

	while (recommendations.length < 20 && (results == null || results?.length > 0)) {
		console.log(
			'Have ' + recommendations.length + ' recommendations, fetching page ' + page + '...'
		);

		try {
			const response: TMDBTrendingTVResponse = await (
				await fetch(
					'https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=' +
						page +
						'&api_key=' +
						process.env.TMDB_API_KEY
				)
			).json();

			results = response.results;
			console.log(response);
		} catch (e) {
			console.error(e);
			return recommendations;
		}

		page = page + 1;

		for (let i = 0; i < results.length; i++) {
			if (recommendations.length >= 20) {
				break;
			}

			if (recommendations.map((el) => el.id).includes(results[i].id)) {
				console.log(
					'Rejected ' +
						results[i].name +
						' (id: ' +
						results[i].id +
						') because we already have it in our recommendations.'
				);
				continue;
			}

			let matchesGenre = false;
			for (let j = 0; j < results[i].genre_ids.length; j++) {
				if (tmdbGenreIds.includes(results[i].genre_ids[j])) {
					matchesGenre = true;
				}
			}

			if (!matchesGenre) {
				console.log(
					'Rejected ' +
						results[i].name +
						' (id: ' +
						results[i].id +
						') because it does not match our genres.'
				);
				continue;
			}

			try {
				const details: TMDBTVDetailsItem = await (
					await fetch(
						'https://api.themoviedb.org/3/tv/' +
							results[i].id +
							'?api_key=' +
							process.env.TMDB_API_KEY
					)
				).json();
				console.log('Accepted ' + details.name + ' (id: ' + details.id + ') from TMDB.');
				recommendations.push(details);
			} catch (e) {
				console.error(e);
				continue;
			}
		}
	}

	return recommendations;
}

export async function GET({ request }) {
	const cookieHeader = request.headers.get('Cookie');
	const sessionId = lucia.readSessionCookie(cookieHeader ?? '');
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

	console.log('User ' + user.id + ' (' + user.name + ') wants a recommendation!');

	// Get our genres
	const genres = await prisma.userGenre.findMany({
		where: {
			userId: user.id
		}
	});

	const genreIds = genres.map((genre) => genre.genreId);

	// Get all genre definitions of genres we like
	const tmdbGenres = await prisma.genre.findMany({
		where: {
			id: { in: genreIds }
		}
	});

	const tmdbGenreIds = tmdbGenres.map((genre) => genre.tmdbTvId);

	// Get our ratings
	const ourRatings = await prisma.userRating.findMany({
		where: {
			userId: user.id
		}
	});

	// Get users that share our genres
	const users = await prisma.userGenre.findMany({
		where: {
			genreId: { in: genreIds },
			userId: { not: user.id }
		}
	});

	let uniqueUsers = [...new Set(users.map((user) => user.userId))];

	let tries = 0;
	let recommendations: TMDBTVDetailsItem[] = [];
	while (true) {
		if (tries > 100) {
			console.log('Too many tries. Returning recommendations.');

			recommendations = await fillRemainingRecommendations(recommendations, tmdbGenreIds);

			return new Response(JSON.stringify({ error: false, recommendations: recommendations }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		if (recommendations.length == 20) {
			console.log('Found all recommendations!');

			return new Response(JSON.stringify({ error: false, recommendations: recommendations }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		console.log('Attempting to find recommendation ' + (recommendations.length + 1) + ' of 20...');
		console.log(recommendations);

		// Select a random user from the list of users that share our genres
		const selectedUserIndex = Math.floor(Math.random() * uniqueUsers.length);
		console.log('Chose user ' + (selectedUserIndex + 1) + ' of ' + uniqueUsers.length);
		const randomUser = uniqueUsers[selectedUserIndex];
		if (!randomUser) {
			console.log('No users found. Returning recommendations.');

			recommendations = await fillRemainingRecommendations(recommendations, tmdbGenreIds);

			return new Response(JSON.stringify({ error: false, recommendations: recommendations }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		// Get the score of this user, which determines the chance that they will be the chosen one
		// This is the number of matching ratings over the number of total shared ratings
		// If the number is 0, then give a 10% chance of choosing this user anyways
		const ourRatedIds = ourRatings.map((rating) => rating.tmdbId);
		const userRatings = await prisma.userRating
			.findMany({
				where: {
					userId: randomUser
				}
			})
			.then((userRatings) =>
				userRatings.filter(
					(rating) =>
						rating.rating !== 'unrated' &&
						!recommendations.map((el) => el.id).includes(rating.tmdbId)
				)
			);

		// This user has no ratings (new user?), so skip them and remove them from the pool
		if (userRatings.length === 0) {
			console.log('User ' + randomUser + ' has no ratings. Skipping...');
			uniqueUsers = uniqueUsers.filter((id) => id !== randomUser);
			tries++;
			continue;
		}

		// Decide whether we choose this user
		const sharedRatings = userRatings.filter((rating) => ourRatedIds.includes(rating.tmdbId));

		if (sharedRatings.length === 0) {
			console.log('User ' + randomUser + ' has no ratings in common.');

			if (Math.random() > 0.9) {
				tries++;
				continue;
			}
		} else {
			const score =
				userRatings.map(
					(rating) =>
						ourRatings.find((ourRating) => ourRating.tmdbId === rating.tmdbId)?.rating ===
						rating.rating
				).length / userRatings.length;

			console.log('Score for user ' + randomUser + ': ' + score);

			if (Math.random() < score) {
				tries++;
				continue;
			}
		}

		console.log('User ' + randomUser + ' was chosen.');

		// Add a recommendation based on what this user liked
		const userRecommendations = userRatings
			.filter((rating) => rating.rating == 'positive')
			.flatMap((rating) => {
				if (rating.type !== 'tv') {
					return [];
				} else if (genreIds.includes(rating.genreId)) {
					return [rating, rating];
				} else {
					return [rating];
				}
			});

		if (userRecommendations.length === 0) {
			console.log('User ' + randomUser + ' has no recommendations. Skipping...');
			uniqueUsers = uniqueUsers.filter((id) => id !== randomUser);
			tries++;
			continue;
		}

		const recommendedShowId =
			userRecommendations[Math.floor(Math.random() * userRecommendations.length)].tmdbId;

		// Query TMDB APIfor the show with this tmdbId
		try {
			const recommendedShow: TMDBTVDetailsItem = await (
				await fetch(
					'https://api.themoviedb.org/3/tv/' +
						recommendedShowId +
						'?api_key=' +
						process.env.TMDB_API_KEY
				)
			).json();
			recommendations.push(recommendedShow);
		} catch (e) {
			console.error(e);
			continue;
		}
	}
}
