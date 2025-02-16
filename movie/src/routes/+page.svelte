<script>
	import MovieItem from "$lib/components/MovieItem.svelte";
	import Movie from "$lib/Movie";

    let movies = [
        new Movie(
			"ironman",
			"Iron Man",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		),
        new Movie(
			"ironman2",
			"Iron Man 2",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		),
        new Movie(
			"ironman3",
			"Iron Man 3",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		),
        new Movie(
			"somemovie",
			"A movie",
			'Movie Description',
			'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
			2008,
			126,
			'Action',
			'PG-13'
		)];
</script>

<div class="flex flex-col items-center justify-center w-full h-full">
    <h1 class="text-2xl font-bold mb-4">Welcome!</h1>

    <div class="grid grid-cols-3 gap-4">
        {#each movies as movie}
            <MovieItem movie={movie}></MovieItem>
        {/each}
    </div>
</div>
