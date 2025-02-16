import type { TMDBMovieDetailsItem } from './server/tmdb';

export default class Movie {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
	year: number;
	length: number;
	genre: string;

	constructor(
		id: number,
		title: string,
		description: string,
		imageUrl: string,
		year: number,
		length: number,
		genre: string
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.imageUrl = imageUrl;
		this.year = year;
		this.length = length;
		this.genre = genre;
	}

	static constructFromServerData(data: TMDBMovieDetailsItem): Movie {
		return new Movie(
			data.id,
			data.title,
			data.overview,
			`https://image.tmdb.org/t/p/original${data.poster_path}`,
			Number(data.release_date.split('-')[0]),
			data.runtime,
			data.genres[0].name
		);
	}

	getFormattedDataString(): string {
		return `${this.year} | ${this.length} m | ${this.genre}`;
	}
}
