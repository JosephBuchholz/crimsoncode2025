<script lang="ts">
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import MediaItem from "$lib/components/MediaItem.svelte";
	import Movie from "$lib/Movie";
	import type { TMDBMovieDetailsItem, TMDBTVDetailsItem } from "$lib/server/tmdb";
	import TVShow from "$lib/TVShow";
	import { onMount } from "svelte";

	let mediaItems: (Movie | TVShow)[] = [];
	let loading = false;

	onMount(() => {
		loadRecommendations();
		window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
	});

	async function loadRecommendations() {
		loading = true;
		const response = await fetch(`http://localhost:5173/api/recommend/${mediaType == "movie" ? "movies" : "tv"}`);

		if (mediaType == "movie")
		{
			const data: TMDBMovieDetailsItem[] = (await response.json()).recommendations;
			data.forEach((recommendation) => {
				mediaItems.push(Movie.constructFromServerData(recommendation));
			});
		}
		else
		{
			const data: TMDBTVDetailsItem[] = (await response.json()).recommendations;
			data.forEach((recommendation) => {
				mediaItems.push(TVShow.constructFromTVServerData(recommendation));
			});
		}


		mediaItems = mediaItems;
		loading = false;
	}

	function handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !loading) {
            loadRecommendations();
        }
    }

	function reloadRecommendations() {
		mediaItems = [];
		loadRecommendations();
	}

	var mediaType = "movie";
</script>

<div class="flex flex-col items-center justify-center w-full h-full">
    <h1 class="text-2xl font-bold mb-4">Welcome!</h1>

	<div class="flex flex-col">
		<button on:click={() => {
			if (mediaType == "movie") return;
			mediaType = "movie";
			reloadRecommendations();
		}}
		class="bg-{mediaType == "movie" ? "primary" : "gray-400"} hover:brightness-110 p-2 m-2 rounded-md text-white"
		>Movies</button>

		<button on:click={() => {
			if (mediaType == "tvshow") return;
			mediaType = "tvshow";
			reloadRecommendations();
		}}

		class="bg-{mediaType == "tvshow" ? "primary" : "gray-400"} hover:brightness-110 p-2 m-2 rounded-md text-white"
		>TV Shows</button>
	</div>

    <div class="grid grid-cols-3 gap-4">
        {#each mediaItems as media}
			<MediaItem media={media}></MediaItem>
		{/each}
    </div>

	{#if loading}
		<LoadingSpinner></LoadingSpinner>
    {/if}
</div>
