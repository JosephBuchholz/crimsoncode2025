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
		genre: string,
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.imageUrl = imageUrl;
		this.year = year;
		this.length = length;
		this.genre = genre;
	}

	getFormattedDataString(): string {
		return `${this.year} | ${this.length} m | ${this.genre}`;
	}
}
