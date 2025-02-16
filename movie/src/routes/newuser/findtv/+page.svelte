<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import { onMount } from "svelte";
	import TVShowRatingItem from "./TVShowRatingItem.svelte";
	import type { TMDBMovieSearchItem, TMDBTVSearchItem } from "$lib/server/tmdb";
	import TVShow from "$lib/TVShow";
    import { page } from '$app/stores';
    let baseUrl : String = $page.url.origin;

    let shows: TVShow[] = [];

    let selectedShows: Record<number, TVShow> = {};

	let loading = false;
	let input = "";
	let findpage = 1;

	onMount(() => {
		loadWatched();
	});

	async function loadWatched() {
		loading = true;
		shows = [];
		const response = await fetch(`${baseUrl}/api/search/tv?q=${input}&page=${findpage}`);

		const data: TMDBTVSearchItem[] = (await response.json()).results;
		data.forEach((el) => {
			shows.push(
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

		shows = shows;
		loading = false;
	}

    function handleSelect(show: TVShow) {
        if (selectedShows[show.id] !== undefined) { // deselect
            delete selectedShows[show.id];
            selectedShows = selectedShows;
            return;
        }
        else {
            selectedShows[show.id] = show;
        }
    }

	async function searchChange() {
		findpage = 1;
		await loadWatched();
	}

	async function autoRate() {
		for (const show of Object.values(selectedShows)) {
			await fetch(`${baseUrl}/api/rate/tv`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: show.id,
					watched: true,
					rating: "positive"
				})
			});
		}

		window.location.href = "/";
	}
</script>

<div class="flex flex-col" style="height: calc(100vh - 200px)">
    <div class="m-6">
        <h1>Select a few TV shows that you enjoyed</h1>
    </div>

    <input type="text" placeholder="Search for shows" class="w-full p-2 border border-gray-300 rounded-lg mb-6" on:change={searchChange} bind:value={input}/>

    <div class="grid grid-cols-3 gap-4 overflow-y-scroll place-items-center">
        {#each shows as show}
            <TVShowRatingItem show={show} onSelect={handleSelect} selected={selectedShows[show.id] !== undefined}></TVShowRatingItem>
        {/each}
    </div>

    <div class="flex flex-row w-full justify-between mt-5">
        <div class="m-6 w-40">
            <LinkButton href="/" color="gray-400" textColor="black">Skip</LinkButton>
        </div>

        <div class="m-6 w-40">
			<button on:click={autoRate} class="w-full text-white bg-primary hover:brightness-110 focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">Continue &rarr;</button>
        </div>
    </div>
</div>