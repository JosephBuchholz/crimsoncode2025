<script lang="ts">
    import { enhance } from "$app/forms";
    export let data;
    const { user } = data;
</script>

{#if user}
  <div class="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">{user?.name}</h1>
    <p class="text-lg mb-4">Email: {user?.email}</p>

    <form action="/?/logout" method="post" use:enhance class="flex flex-col">
      <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
        Logout
      </button>
    </form>
  </div>
{/if}