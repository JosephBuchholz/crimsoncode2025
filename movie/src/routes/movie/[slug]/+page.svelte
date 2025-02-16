<script lang="ts">
	import Icon from "@iconify/svelte";

    export let data;
    const { movie, serverWatched, serverRating } = data;

    let watched = serverWatched;
    let rating = serverRating; // can be 0 (none), 1 (good), or 2 (bad)

    $: goodButtonColor = rating === 1 ? "green" : "gray-400";
    $: badButtonColor = rating === 2 ? "red" : "gray-400";

    const backendRatings = ["unrated", "positive", "negative"]

    async function updateRating() {
        try {
            const response = await fetch('/api/rate/movie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: movie.id, watched: watched, rating: backendRatings[rating], genres: movie.genres })
            });
            if (!response.ok) {
                console.error('Failed to update rating');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function handleOnWatchedButtonClicked() {
        watched = !watched;
        updateRating();
    }

    async function handleOnGoodButtonClicked() {
        if (rating === 1) rating = 0;
        else rating = 1;
        updateRating();
    }

    async function handleOnBadButtonClicked() {
        if (rating === 2) rating = 0;
        else rating = 2;
        updateRating();
    }
</script>


<div class="flex flex-col m-4 p-4 w-full">
    <div class="flex flex-row w-full">
        <div class="flex flex-col flex-1 m-4">
            <h1 class="text-3xl font-semibold mt-2">{movie.title}</h1>
            <p class="text-sm text-gray-600 mt-1">{movie.year}</p>

            <p class="text-sm text-gray-600 mt-6">{movie.description}</p>

            <div class="mt-8 m-2">
                {#if watched}
                    <button on:click={handleOnWatchedButtonClicked} class="w-full text-white bg-green-500 hover:bg-green-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Watched
                    </button>
                {:else}
                    <button on:click={handleOnWatchedButtonClicked} class="w-full text-white bg-gray-400 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Not Watched
                    </button>
                {/if}

                {#if watched}
                    <p class="text-2xl font-semibold mt-10 mb-2">Rate</p>

                    <div class="flex flex-row items-center content-center">
                        <div class="self-center">
                            <button on:click={handleOnGoodButtonClicked} class="text-white bg-{goodButtonColor} hover:brightness-110 font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
                                <Icon width="24" height="24" icon="material-symbols:thumb-up" />
                            </button>

                            <button on:click={handleOnBadButtonClicked} class="text-white bg-{badButtonColor} hover:brightness-110 font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
                                <Icon width="24" height="24" icon="material-symbols:thumb-down"/>
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <div class="justify-end flex-1">
            <img src={movie.imageUrl} alt={movie.title} class="rounded-lg" style="margin: auto; max-height: 70vh" />
        </div>
    </div>
</div>
