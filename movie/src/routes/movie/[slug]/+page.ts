import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Movie from '$lib/Movie';

export const load: PageLoad = ({ params }) => {
	console.log(params.slug);
	return {
		movie: new Movie(
			params.slug,
			params.slug,
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		)
	};
};
