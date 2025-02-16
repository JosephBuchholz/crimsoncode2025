<script lang="ts">
	import Icon from "@iconify/svelte";

    export let rating: string;
</script>

{#if rating == "positive"}
    <button class="text-white bg-green font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
        <Icon width="24" height="24" icon="material-symbols:thumb-up" />
    </button>
{:else if rating == "negative"}
    <button class="text-white bg-red font-medium rounded-lg text-sm h-10 px-2 text-center m-2">
        <Icon width="24" height="24" icon="material-symbols:thumb-down"/>
    </button>
{/if}