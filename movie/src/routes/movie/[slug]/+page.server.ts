import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Movie from '$lib/Movie';
import type { TMDBMovieDetailsItem } from '$lib/server/tmdb.js';

export const load: PageLoad = async ({ params }) => {
	const response = await fetch(
		'https://api.themoviedb.org/3/movie/' + params.slug + '?api_key=' + process.env.TMDB_API_KEY
	);
	if (response.status === 200) {
		const movieItem: TMDBMovieDetailsItem = await response.json();
		const movie = new Movie(
			movieItem.id,
			movieItem.title,
			movieItem.overview,
			'https://image.tmdb.org/t/p/original' + movieItem.poster_path,
			Number(movieItem.release_date.split('-')[0]),
			movieItem.runtime,
			movieItem.genres.map((genre) => genre.name).join(', ')
		);

		return {
			movie: {
				id: movie.id,
				title: movie.title,
				description: movie.description,
				imageUrl: movie.imageUrl,
				year: movie.year,
				length: movie.length,
				genre: movie.genre
			}
		};
	} else {
		return error(404, 'Movie not found');
	}
};
