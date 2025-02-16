<script lang="ts">
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
import MovieItem from "$lib/components/MovieItem.svelte";
	import Movie from "$lib/Movie";
	import type { TMDBMovieDetailsItem } from "$lib/server/tmdb";
	import { onMount } from "svelte";

	let movies: Movie[] = [];
	let loading = false;

	onMount(() => {
		loadRecommendations();
		window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
	});

	async function loadRecommendations() {
		loading = true;
		const response = await fetch('http://localhost:5173/api/recommend/movies');
		const data: TMDBMovieDetailsItem[] = (await response.json()).recommendations;
		data.forEach((recommendation) => {
			movies.push(Movie.constructFromServerData(recommendation));
		});
		movies = movies;
		loading = false;
	}

	function handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !loading) {
            loadRecommendations();
        }
    }
</script>

<div class="flex flex-col items-center justify-center w-full h-full">
    <h1 class="text-2xl font-bold mb-4">Welcome!</h1>

    <div class="grid grid-cols-3 gap-4">
        {#each movies as movie}
            <MovieItem movie={movie}></MovieItem>
        {/each}
    </div>

	{#if loading}
		<LoadingSpinner></LoadingSpinner>
    {/if}
</div>
