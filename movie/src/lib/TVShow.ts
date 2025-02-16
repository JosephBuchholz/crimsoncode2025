import type { TMDBTVDetailsItem } from './server/tmdb';

export default class TVShow {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
	year: number;
	genre: string;

	constructor(
		id: number,
		title: string,
		description: string,
		imageUrl: string,
		year: number,
		genre: string
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.imageUrl = imageUrl;
		this.year = year;
		this.genre = genre;
	}

	static constructFromTVServerData(data: TMDBTVDetailsItem): Movie {
		return new TVShow(
			data.id,
			data.name,
			data.overview,
			`https://image.tmdb.org/t/p/original${data.poster_path}`,
			Number(data.first_air_date.split('-')[0]),
			data.genres[0].name
		);
	}

	getFormattedDataString(): string {
		return `${this.year} | ${this.genre}`;
	}
}
