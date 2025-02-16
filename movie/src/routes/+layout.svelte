<script lang="ts">
	import '../app.css';
	import Navbar from "$lib/Navbar.svelte"; 
	import Footer from "$lib/Footer.svelte";
    export let data;
</script>

<div class="max-w-screen-xl mx-auto p-4">
	<Navbar isLoggedIn={data.user != null} />

	<div class="p-10">
		<slot {data}/>
	</div>

	<Footer/>
</div>
