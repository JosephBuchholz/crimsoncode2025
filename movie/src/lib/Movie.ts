import type { TMDBMovieDetailsItem } from './server/tmdb';

type MovieGenre = {
	id: number;
	name: string;
};

export default class Movie {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
	year: number;
	length: number;
	genres: MovieGenre[];

	constructor(
		id: number,
		title: string,
		description: string,
		imageUrl: string,
		year: number,
		length: number,
		genres: MovieGenre[]
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.imageUrl = imageUrl;
		this.year = year;
		this.length = length;
		this.genres = genres;
	}

	static constructFromServerData(data: TMDBMovieDetailsItem): Movie {
		return new Movie(
			data.id,
			data.title,
			data.overview,
			`https://image.tmdb.org/t/p/original${data.poster_path}`,
			Number(data.release_date.split('-')[0]),
			data.runtime,
			data.genres
		);
	}

	getFormattedDataString(): string {
		return `${this.year} | ${this.length} m | ${this.genres.map((genre) => genre.name).join(', ')}`;
	}
}
