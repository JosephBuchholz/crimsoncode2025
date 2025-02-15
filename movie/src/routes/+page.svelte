<script lang="ts">
    import { enhance } from "$app/forms";
    export let data;
    const { user } = data;
    console.log(user);
</script>

<h1 class="">Welcome!</h1>

{#if user}
  <h1>Hello, {user?.email}</h1>
{/if}

{#if data.user}
  <form action="/?/logout" method="post" use:enhance>
      <button class="w3-bar-item w3-button">Logout</button>
  </form>
{/if}
