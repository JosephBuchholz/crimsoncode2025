<script>
    export let href = '';
    export let color = 'primary';
    export let textColor = 'white';
</script>

<a href={href}>
    <button class="w-full text-{textColor} bg-{color} hover:brightness-110 focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"><slot></slot></button>
</a>

<!-- Otherwise tailwind classes may be stripped -->
{#if false}
    <div class="bg-gray-400 bg-red-500 bg-green-500 bg-green bg-red
        text-black"></div>
{/if}
