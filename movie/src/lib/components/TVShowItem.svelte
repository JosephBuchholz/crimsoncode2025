<script lang="ts">
	import type TVShow from "$lib/TVShow";
    import Rating from "$lib/components/Rating.svelte";

    export let tvShow: TVShow;

    export let rating: string | undefined = undefined;
</script>

<a href="/tv/{tvShow.id}" class="m-4">
    <div class="flex flex-col items-center p-4 border border-gray-300 rounded-sm w-48">
        <img src={tvShow.imageUrl} alt={tvShow.name} class="w-full rounded-sm" />

        <div class="justify-start">
            <h1 class="text-lg font-semibold mt-2">{tvShow.name}</h1>
            <p class="text-sm text-gray-600 mt-1">{tvShow.getFormattedDataString()}</p>
        </div>

        {#if rating}
            <Rating rating={rating}></Rating>
        {/if}
    </div>
</a>