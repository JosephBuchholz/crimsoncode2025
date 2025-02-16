<script lang="ts">
    import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import LinkButton from "$lib/components/LinkButton.svelte";
	import AuthActionButton from "../../lib/components/AuthActionButton.svelte";
    export let data;
    const { user } = data;
</script>

{#if user}
  <div class="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">{user?.name}</h1>
    <p class="text-lg mb-4">Email: {user?.email}</p>

    <LinkButton href="/profile/library">Your Library</LinkButton>

    <form action="/?/logout" method="post" use:enhance class="flex flex-col">
      <AuthActionButton>Logout</AuthActionButton>
    </form>
  </div>
{/if}