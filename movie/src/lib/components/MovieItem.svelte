<script lang="ts">
	import type Movie from "$lib/Movie";
    import Rating from "$lib/components/Rating.svelte";

    export let movie: Movie;

    export let rating: string | undefined = undefined;
</script>

<a href="/movie/{movie.id}" class="m-2 border border-gray-300 rounded-sm">
    <div class="flex flex-col items-center p-4 w-48">
        <img src={movie.imageUrl} alt={movie.title} class="w-full rounded-sm" />

        <div class="justify-start">
            <h1 class="text-lg font-semibold mt-2">{movie.title}</h1>
            <p class="text-sm text-gray-600 mt-1">{movie.getFormattedDataString()}</p>
        </div>

        {#if rating}
            <Rating rating={rating}></Rating>
        {/if}
    </div>
</a>