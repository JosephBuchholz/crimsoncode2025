<script lang="ts">
	import type Movie from "$lib/Movie";

    export let movie: Movie;
    export let selected: boolean;
    export let onSelect: (movie: Movie) => void;
</script>

<button class="{selected ? "bg-blue-300" : "bg-white"} m-2 border border-gray-300 rounded-sm" on:click={() => { onSelect(movie); }}>
    <div class="flex flex-col items-center p-4 w-48">
        <img src={movie.imageUrl} alt={movie.title} class="w-full rounded-sm" />

        <div class="justify-start">
            <h1 class="text-lg font-semibold mt-2">{movie.title}</h1>
            <p class="text-sm text-gray-600 mt-1">{movie.year}</p>
        </div>
    </div>
</button>