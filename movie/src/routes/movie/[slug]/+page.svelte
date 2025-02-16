<script lang="ts">
    export let data;
    const { movie } = data;
</script>

<div class="flex flex-col m-4 p-4 w-full">
    <div class="flex flex-row w-full">
        <div class="flex-1">
            <h1 class="text-xlg font-semibold mt-2">{movie.title}</h1>
            <p class="text-sm text-gray-600 mt-1">{movie.year} | {movie.ageRating} | {movie.length} | {movie.genre}</p>

            <p class="text-sm text-gray-600 mt-6">{movie.description}</p>
        </div>

        <div class="justify-end flex-1">
            <img src={movie.imageUrl} alt={movie.title} class="w-full rounded-lg" />
        </div>
    </div>

    <p>something down here</p>
</div>
