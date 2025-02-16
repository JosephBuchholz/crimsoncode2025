<script lang="ts">
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import MediaGrid from "$lib/components/MediaGrid.svelte";
	import MediaItem from "$lib/components/MediaItem.svelte";
	import Movie from "$lib/Movie";
	import type { TMDBMovieDetailsItem, TMDBMovieSearchItem, TMDBTVDetailsItem, TMDBTVSearchItem } from "$lib/server/tmdb";
	import TVShow from "$lib/TVShow";
	import { onMount } from "svelte";
	import { page } from '$app/stores';
    let baseUrl : String = $page.url.origin;

	let mediaItems: (Movie | TVShow)[] = [];
	let loading = false;
	let input = "";
	let recommendations : number[] = []

	onMount(() => {
		loadRecommendations();
		window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
	});

	async function loadRecommendations() {
		loading = true;
		const response = await fetch(`${baseUrl}/api/recommend/${mediaType == "movie" ? "movies" : "tv"}?exclude=${recommendations}`);

		if (mediaType == "movie")
		{
			const data: TMDBMovieDetailsItem[] = (await response.json()).recommendations;
			data.forEach((recommendation) => {
				mediaItems.push(Movie.constructFromServerData(recommendation));
				recommendations.push(recommendation.id);
			});
		}
		else
		{
			const data: TMDBTVDetailsItem[] = (await response.json()).recommendations;
			data.forEach((recommendation) => {
				mediaItems.push(TVShow.constructFromTVServerData(recommendation));
				recommendations.push(recommendation.id);
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

	async function searchChange() {
		mediaItems = [];

		if (input == undefined || input == "") {
			loadRecommendations();
			return;
		}

		loading = true;

		if (mediaType == "movie")
		{
			const response = await fetch(`${baseUrl}/api/search/movies?q=${input}&page=${1}`);

			const data: TMDBMovieSearchItem[] = (await response.json()).results;
			data.forEach((el) => {
				mediaItems.push(
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
		}
		else
		{
			const response = await fetch(`${baseUrl}/api/search/tv?q=${input}&page=${1}`);

			const data: TMDBTVSearchItem[] = (await response.json()).results;
			data.forEach((el) => {
				mediaItems.push(
					new TVShow(
						el.id,
						el.name,
						el.overview,
						`https://image.tmdb.org/t/p/original${el.poster_path}`,
						Number(el.first_air_date.split('-')[0]),
						[]
					)
				)
			});
		}

		mediaItems = mediaItems;

		loading = false;
	}

	var mediaType = "movie";
</script>

<div class="flex flex-col justify-start w-full h-full">
	<div class="flex flex-row">
		<button on:click={() => {
			if (mediaType == "movie") return;
			mediaType = "movie";
			reloadRecommendations();
		}}
		class="bg-{mediaType == "movie" ? "primary" : "gray-400"} hover:brightness-110 p-2 m-2 w-full rounded-md text-white"
		>Movies</button>

		<button on:click={() => {
			if (mediaType == "tvshow") return;
			mediaType = "tvshow";
			reloadRecommendations();
		}}

		class="bg-{mediaType == "tvshow" ? "primary" : "gray-400"} hover:brightness-110 p-2 m-2 w-full rounded-md text-white"
		>TV Shows</button>
	</div>

	<div class="m-2 mb-4">
		<input type="text" placeholder="Search" class="w-full p-2 my-2 border border-gray-300 rounded-lg self-center h-10" on:change={searchChange} bind:value={input}/>
	</div>

	<div class="flex flex-col items-center w-full">
		<MediaGrid>
			{#each mediaItems as media}
				<MediaItem media={media}></MediaItem>
			{/each}
		</MediaGrid>
	</div>

	{#if loading}
		<div class="flex flex-col items-center w-full">
			<LoadingSpinner></LoadingSpinner>
		</div>
    {/if}
</div>
