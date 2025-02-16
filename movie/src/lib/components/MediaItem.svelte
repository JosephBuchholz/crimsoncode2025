<script lang="ts">
	import Movie from "$lib/Movie";
	import type TVShow from "$lib/TVShow";
	import MovieItem from "./MovieItem.svelte";
	import TVShowItem from "./TVShowItem.svelte";

    export let media: Movie | TVShow;
</script>

{#if media instanceof Movie}
    <MovieItem movie={media}></MovieItem>
{:else}
    <TVShowItem tvShow={media}></TVShowItem>
{/if}