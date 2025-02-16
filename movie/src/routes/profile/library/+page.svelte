<script lang="ts">
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import Movie from "$lib/Movie";
	import type { TMDBMovieDetailsItem, TMDBTVDetailsItem } from "$lib/server/tmdb";
	import TVShow from "$lib/TVShow";
	import { onMount } from "svelte";
	import MediaGrid from "$lib/components/MediaGrid.svelte";
	import MediaItem from "$lib/components/MediaItem.svelte";
	import { page } from '$app/stores';
    let baseUrl : String = $page.url.origin;

	let mediaItems: ({ media: Movie | TVShow, rating: string })[] = [];
	let loading = false;

	onMount(() => {
		loadWatched();
	});

	async function loadWatched() {
		loading = true;
		const response = await fetch(`${baseUrl}/api/watched/${mediaType == "movie" ? "movies" : "tv"}`);

		if (mediaType == "movie")
		{
			const data = (await response.json()).watched;

			data.forEach((item: any) => {
				const movie: TMDBMovieDetailsItem = item.item;
				const rating: string = item.rating;
				console.log(rating);

				mediaItems.push({ media: Movie.constructFromServerData(movie), rating: rating });
			});
		}
		else
		{
			const data = (await response.json()).watched;

			data.forEach((item: any) => {
				const show: TMDBTVDetailsItem = item.item;
				const rating: string = item.rating;

				mediaItems.push({ media: TVShow.constructFromTVServerData(show), rating: rating });
			});
		}


		mediaItems = mediaItems;
		loading = false;
	}

	function reloadWatched() {
		mediaItems = [];
		loadWatched();
	}

	var mediaType = "movie";
</script>

<div class="flex flex-col center-content  justify-center w-full h-full">
    <h1 class="text-2xl font-bold ml-auto mr-auto mb-4">Your Library</h1>

	<div class="flex flex-row ml-auto mr-auto">
		<button on:click={() => {
			if (mediaType == "movie") return;
			mediaType = "movie";
			reloadWatched();
		}}
		class="bg-{mediaType == "movie" ? "primary" : "gray-400"} hover:brightness-110 p-2 m-2 rounded-md text-white"
		>Movies</button>

		<button on:click={() => {
			if (mediaType == "tvshow") return;
			mediaType = "tvshow";
			reloadWatched();
		}}

		class="bg-{mediaType == "tvshow" ? "primary" : "gray-400"} hover:brightness-110 p-2 m-2 rounded-md text-white"
		>TV Shows</button>
	</div>

	<div class="flex justify-center">
		<MediaGrid>
			{#each mediaItems as media}
				<MediaItem media={media.media} rating={media.rating}></MediaItem>
			{/each}
		</MediaGrid>

		{#if loading}
			<LoadingSpinner></LoadingSpinner>
		{/if}
	</div>
</div>
