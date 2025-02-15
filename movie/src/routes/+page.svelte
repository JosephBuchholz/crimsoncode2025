<script lang="ts">
    import { enhance } from "$app/forms";
    export let data;
    const { user } = data;
    console.log(user);
</script>

<h1>Welcome!</h1>
<h1>Hello, {user?.email}</h1>

{#if data.user}
  <form action="/?/logout" method="post" use:enhance>
      <button class="w3-bar-item w3-button">Logout</button>
  </form>
{/if}
