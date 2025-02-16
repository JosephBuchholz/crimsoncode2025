<script lang="ts">
	import Movie from "$lib/Movie";
	import type TVShow from "$lib/TVShow";
	import Icon from "@iconify/svelte";

    export let media: Movie | TVShow;
    let movie: Movie = media as Movie;
    let tvShow: TVShow = media as TVShow;

    export let rating: string;
</script>

{#if media instanceof Movie}
    <a href="/movie/{movie.id}" class="m-4">
        <div class="flex flex-col items-center p-4 border border-gray-300 rounded-sm w-48">
            <img src={movie.imageUrl} alt={movie.title} class="w-full rounded-sm" />

            <div class="justify-start">
                <h1 class="text-lg font-semibold mt-2">{movie.title}</h1>
                <p class="text-sm text-gray-600 mt-1">{movie.getFormattedDataString()}</p>
            </div>

            {#if rating == "positive"}
                <button class="text-white bg-green font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
                    <Icon width="24" height="24" icon="material-symbols:thumb-up" />
                </button>
            {:else if rating == "negative"}
                <button class="text-white bg-red font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
                    <Icon width="24" height="24" icon="material-symbols:thumb-down"/>
                </button>
            {/if}
        </div>
    </a>
{:else}
    <a href="/tv/{tvShow.id}" class="m-4">
        <div class="flex flex-col items-center p-4 border border-gray-300 rounded-sm w-48">
            <img src={tvShow.imageUrl} alt={tvShow.name} class="w-full rounded-sm" />

            <div class="justify-start">
                <h1 class="text-lg font-semibold mt-2">{tvShow.name}</h1>
                <p class="text-sm text-gray-600 mt-1">{tvShow.getFormattedDataString()}</p>
            </div>
            
            {#if rating == "positive"}
                <button class="text-white bg-green font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
                    <Icon width="24" height="24" icon="material-symbols:thumb-up" />
                </button>
            {:else if rating == "negative"}
                <button class="text-white bg-red font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
                    <Icon width="24" height="24" icon="material-symbols:thumb-down"/>
                </button>
            {/if}
        </div>
    </a>
{/if}