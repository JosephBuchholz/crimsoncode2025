<script lang="ts">
    import { page } from '$app/stores';

    export let isLoggedIn;

    let baseUrl : String = $page.url.origin;

    let showMenu = false;
  
    function toggleNavbar() {
      showMenu = !showMenu;
    }
</script>
  
<nav class="container px-6 mx-auto md:flex md:justify-between md:items-center">
    <div class="flex items-center justify-between">
        <a
        class="text-xl font-bold text-gray-800 md:text-2xl hover:text-blue-400"
        href="/"
        >ProductName
        </a>
        <div class="flex md:hidden">
            <button
                type="button"
                on:click={toggleNavbar}
                class="p-1 rounded-full text-black hover:bg-gray-200 text-black cursor-pointer"
                aria-label="Toggle nav menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
    </div>

    <div
        class="flex-col mt-8 space-y-4 md:flex md:space-y-0 md:flex-row md:items-center md:mt-0 {showMenu
        ? 'flex'
        : 'hidden'}"
    >
        <a class="px-6 py-4 rounded-md text-black hover:bg-gray-200" href="/">Explore</a>
        <a class="px-6 py-4 rounded-md text-black hover:bg-gray-200" href="/about">About</a>

        {#if isLoggedIn}
            <a class="px-6 py-4 rounded-md text-black hover:bg-gray-200" href="/profile">Profile</a>
        {:else}
            <a class="px-6 py-4 rounded-md text-black hover:bg-gray-200" href="/login">Login</a>
        {/if}
    </div>
</nav>