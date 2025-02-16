<script lang="ts">
	import type Movie from "$lib/Movie";

    export let movie: Movie;
</script>

<a href="/movie/{movie.id}" class="m-4">
    <div class="flex flex-col items-center p-4 border border-gray-300 rounded-sm w-48">
        <img src={movie.imageUrl} alt={movie.title} class="w-full rounded-sm" />

        <div class="justify-start">
            <h1 class="text-lg font-semibold mt-2">{movie.title}</h1>
            <p class="text-sm text-gray-600 mt-1">{movie.getFormattedDataString()}</p>
        </div>
    </div>
</a>