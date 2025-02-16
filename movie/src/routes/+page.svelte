<script lang="ts">
	import MovieItem from "$lib/components/MovieItem.svelte";
	import Movie from "$lib/Movie";
	import type { TMDBMovieDetailsItem } from "$lib/server/tmdb";
	import { onMount } from "svelte";

	let movies: Movie[] = [];

	onMount(async () => {
		const response = await fetch('http://localhost:5173/api/recommend/movies');
		const data: TMDBMovieDetailsItem[] = (await response.json()).recommendations;
		data.forEach((recommendation) => {
			movies.push(Movie.constructFromServerData(recommendation));
		});
		movies = movies;
	});
</script>

<div class="flex flex-col items-center justify-center w-full h-full">
    <h1 class="text-2xl font-bold mb-4">Welcome!</h1>

    <div class="grid grid-cols-3 gap-4">
        {#each movies as movie}
            <MovieItem movie={movie}></MovieItem>
        {/each}
    </div>
</div>
