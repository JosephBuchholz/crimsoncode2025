<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import Movie from "$lib/Movie";
	import MovieRatingItem from "./MovieRatingItem.svelte";

    let movies = [
        new Movie(
			"ironman",
			"Iron Man",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		),
        new Movie(
			"ironman2",
			"Iron Man 2",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		),
        new Movie(
			"ironman3",
			"Iron Man 3",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		),
        new Movie(
			"somemovie",
			"A movie",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		)];

    let selectedMovies: Record<string, Movie> = {};

    function handleSelect(movie: Movie) {
        console.log(movie);
        if (selectedMovies[movie.id] !== undefined) { // deselect
            delete selectedMovies[movie.id];
            selectedMovies = selectedMovies;
            return;
        }
        else {
            selectedMovies[movie.id] = movie;
        }
    }
</script>

<div class="flex flex-col" style="height: calc(100vh - 200px)">
    <div class="m-6">
        <h1>Search for movies that you have enjoyed</h1>
    </div>

    <input type="text" placeholder="Search for movies" class="w-full p-2 border border-gray-300 rounded-lg mb-6">

    <div class="grid grid-cols-3 gap-4 overflow-y-scroll place-items-center">
        {#each movies as movie}
            <MovieRatingItem movie={movie} onSelect={handleSelect} selected={selectedMovies[movie.id] !== undefined}></MovieRatingItem>
        {/each}
    </div>

    <div class="flex flex-row w-full justify-between mt-5">
        <div class="m-6 w-40">
            <LinkButton href="/" color="gray-400" textColor="black">Skip</LinkButton>
        </div>

        <div class="m-6 w-40">
            <LinkButton href="/">Continue &rarr;</LinkButton>
        </div>
    </div>
</div>