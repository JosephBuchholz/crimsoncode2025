export default class Movie {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	year: number;
	length: number;
	genre: string;
	ageRating: string;

	constructor(
		id: string,
		title: string,
		description: string,
		imageUrl: string,
		year: number,
		length: number,
		genre: string,
		ageRating: string
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.imageUrl = imageUrl;
		this.year = year;
		this.length = length;
		this.genre = genre;
		this.ageRating = ageRating;
	}

	getFormattedDataString(): string {
		return `${this.year} | ${this.ageRating} | ${this.length} m | ${this.genre}`;
	}
}
