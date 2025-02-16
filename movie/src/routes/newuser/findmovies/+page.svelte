<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import Movie from "$lib/Movie";
	import { onMount } from "svelte";
	import MovieRatingItem from "./MovieRatingItem.svelte";
	import type { TMDBMovieSearchItem } from "$lib/server/tmdb";
	import { page } from '$app/stores';
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import MediaGrid from "$lib/components/MediaGrid.svelte";
	import MediaItem from "$lib/components/MediaItem.svelte";
    let baseUrl : String = $page.url.origin;

    let movies: Movie[] = [];

    let selectedMovies: Record<number, Movie> = {};

	let loading = false;
	let input = "";
	let findpage = 1;

	onMount(() => {
		loadWatched();
	});

	async function loadWatched() {
		loading = true;
		movies = [];
		const response = await fetch(`${baseUrl}/api/search/movies?q=${input}&page=${findpage}`);

		const data: TMDBMovieSearchItem[] = (await response.json()).results;
		data.forEach((el) => {
			movies.push(
				new Movie(
					el.id,
					el.title,
					el.overview,
					`https://image.tmdb.org/t/p/original${el.poster_path}`,
					Number(el.release_date.split('-')[0]),
					0,
					[]
				)
			)
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

	async function searchChange() {
		findpage = 1;
		await loadWatched();
	}

	async function autoRate() {
		for (const movie of Object.values(selectedMovies)) {
			await fetch(`${baseUrl}/api/rate/movie`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: movie.id,
					watched: true,
					rating: "positive"
				})
			});
		}

		window.location.href = "/newuser/findtv";
	}
</script>

<div class="flex flex-col" style="height: calc(100vh - 200px)">
    <div class="m-6">
        <h1>Select a few movies that you enjoyed</h1>
    </div>

    <input type="text" placeholder="Search for movies" class="w-full p-2 border border-gray-300 rounded-lg mb-6" on:change={searchChange} bind:value={input}/>

	<div class="flex flex-col w-full items-center overflow-y-scroll">
		<MediaGrid>
			{#each movies as movie}
				<MovieRatingItem movie={movie} onSelect={handleSelect} selected={selectedMovies[movie.id] !== undefined}></MovieRatingItem>
			{/each}
		</MediaGrid>
	</div>

	{#if loading}
		<div class="flex flex-col items-center w-full">
			<LoadingSpinner></LoadingSpinner>
		</div>
    {/if}

    <div class="flex flex-row w-full justify-between mt-5">
        <div class="m-6 w-40">
            <LinkButton href="/" color="gray-400" textColor="black">Skip</LinkButton>
        </div>

        <div class="m-6 w-40">
			<button on:click={autoRate} class="w-full text-white bg-primary hover:brightness-110 focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">Continue &rarr;</button>
        </div>
    </div>
</div>