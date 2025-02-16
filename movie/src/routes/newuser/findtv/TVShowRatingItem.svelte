<script lang="ts">
	import type TVShow from "$lib/TVShow";

    export let show: TVShow;
    export let selected: boolean;
    export let onSelect: (show: TVShow) => void;
</script>

<button class="{selected ? "bg-blue-300" : "bg-white"} flex flex-col items-center p-4 border border-gray-300 rounded-sm w-48" on:click={() => { onSelect(show); }}>
    <img src={show.imageUrl} alt={show.name} class="w-full rounded-sm" />

    <div class="justify-start">
        <h1 class="text-lg font-semibold mt-2">{show.name}</h1>
        <p class="text-sm text-gray-600 mt-1">{show.year}</p>
    </div>
</button>