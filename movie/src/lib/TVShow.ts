import type { TMDBTVDetailsItem } from './server/tmdb';

type TVGenre = {
	id: number;
	name: string;
}

export default class TVShow {
	id: number;
	name: string;
	description: string;
	imageUrl: string;
	year: number;
	genres: TVGenre[];

	constructor(
		id: number,
		name: string,
		description: string,
		imageUrl: string,
		year: number,
		genres: TVGenre[]
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.imageUrl = imageUrl;
		this.year = year;
		this.genres = genres;
	}

	static constructFromTVServerData(data: TMDBTVDetailsItem): TVShow {
		return new TVShow(
			data.id,
			data.name,
			data.overview,
			`https://image.tmdb.org/t/p/original${data.poster_path}`,
			Number(data.first_air_date.split('-')[0]),
			data.genres
		);
	}

	getFormattedDataString(): string {
		return `${this.year} | ${this.genres.map((genre) => genre.name).join(', ')}`;
	}
}
