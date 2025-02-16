<script>
    export let href = '';
</script>

<a href={href}>
    <button class="w-full text-white bg-primary hover:bg-primary-light focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"><slot></slot></button>
</a>
