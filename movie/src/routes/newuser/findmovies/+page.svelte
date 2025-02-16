<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import Movie from "$lib/Movie";
	import { onMount } from "svelte";
	import MovieRatingItem from "./MovieRatingItem.svelte";
	import type { TMDBMovieDetailsItem } from "$lib/server/tmdb";

    let movies: Movie[] = [];

    let selectedMovies: Record<number, Movie> = {};

	let loading = false;
	let input = "";

	onMount(() => {
		loadWatched();
	});

	async function loadWatched() {
		loading = true;
		const response = await fetch(`http://localhost:5173/api/recommend/movies`);

		const data: TMDBMovieDetailsItem[] = (await response.json()).recommendations;
		data.forEach((recommendation) => {
			movies.push(Movie.constructFromServerData(recommendation));
		});

		movies = movies;
		loading = false;
	}

    function handleSelect(movie: Movie) {
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
        <h1>Select a few movies that you enjoyed</h1>
    </div>

    <input type="text" placeholder="Search for movies" class="w-full p-2 border border-gray-300 rounded-lg mb-6" bind:value={input}/>

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