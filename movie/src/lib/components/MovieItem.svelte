<script lang="ts">
    export let title: string;
    export let description: string;
    export let imageUrl: string;
</script>

<div class="flex flex-col items-center m-4 p-4 border border-gray-300 rounded-lg w-48">
    <img src={imageUrl} alt={title} class="w-full rounded-lg" />
    <h1 class="text-lg font-semibold mt-2">{title}</h1>
    <p class="text-sm text-gray-600 mt-1">{description}</p>
</div>