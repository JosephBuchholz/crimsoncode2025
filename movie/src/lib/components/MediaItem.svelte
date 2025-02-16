<script lang="ts">
	import Movie from "$lib/Movie";
	import type TVShow from "$lib/TVShow";
	import MovieItem from "./MovieItem.svelte";
	import TVShowItem from "./TVShowItem.svelte";

    export let media: Movie | TVShow;

    export let rating: string | undefined = undefined;
</script>

{#if media instanceof Movie}
    <MovieItem rating={rating} movie={media}></MovieItem>
{:else}
    <TVShowItem rating={rating} tvShow={media}></TVShowItem>
{/if}