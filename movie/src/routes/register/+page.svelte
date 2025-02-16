<script>
    import { enhance } from "$app/forms";
	import TextLink from "$lib/components/TextLink.svelte";
	import RequiredTag from "$lib/components/RequiredTag.svelte";
	import AuthActionButton from "../../lib/components/AuthActionButton.svelte";
	import FormField from "../../lib/components/FormField.svelte";
    import Select from "svelte-select";
	import Icon from "@iconify/svelte";

    let value = null;
	let items = [
		"Action",
		"Adventure",
		"Animation",
		"Comedy",
		"Crime",
		"Documentary",
		"Drama",
		"Family",
		"Fantasy",
		"History",
		"Horror",
		"Music",
		"Mystery",
		"Romance",
		"Sci-Fi",
		"Thriller",
		"War",
		"Western"
	];
</script>

<div class="w3-card w3-margin w3-padding">
	<div class="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
		<div class="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
			 <h1 class="text-3xl font-bold text-black my-auto">Sign up</h1>
		</div>

		<form class="flex flex-col" method="post" use:enhance>
			<FormField name="name" id="name" type="name" placeholder="Your Name" required>
				Name

				<Icon slot="icon" width="24" height="24" icon="material-symbols:account-circle-outline" />
			</FormField>
			
			<FormField name="email" id="email" type="email" placeholder="Your Email" required>
				Email
				
				<Icon slot="icon" width="24" height="24" icon="material-symbols:mail-outline" />
			</FormField>
			
			<FormField name="password" id="password" type="password" placeholder="••••••••••" required>
				Password
				
				<Icon slot="icon" width="24" height="24" icon="material-symbols:password" />
			</FormField>

			<label for="genres" class="block mb-2 text-sm font-medium text-[#111827]">Preferred Genres<RequiredTag/></label>
			<div class="mb-4">
				<Select name="genres" multiple required {items} bind:value/>
			</div>

        	<AuthActionButton>Sign Up</AuthActionButton>
			<div class="text-sm font-light text-[#6B7280] text-center">
				Already have an account? <TextLink href="/login">Login</TextLink>
			</div>
		</form>
	</div>
</div>