<script>
    import { enhance } from "$app/forms";
	import TextLink from "$lib/components/TextLink.svelte";
	import AuthActionButton from "../../lib/components/AuthActionButton.svelte";
	import FormField from "../../lib/components/FormField.svelte";
</script>

<div class="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
	<div class="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
         <h1 class="text-3xl font-bold text-black my-auto">Login</h1>
    </div>

    <form class="flex flex-col" method="post" use:enhance>
        <FormField name="email" id="email" type="email" placeholder="Your Email">
            Email

            <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
        </FormField>

        <FormField name="password" id="password" type="password" placeholder="Your Password">
            Password

            <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-asterisk"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M12 8v8"></path><path d="m8.5 14 7-4"></path><path d="m8.5 10 7 4"></path></svg>
        </FormField>
        
        <AuthActionButton>Login</AuthActionButton>

        <div class="text-center text-sm font-light text-[#6B7280] ">
            Don't have an accout yet? <TextLink href="/register">Sign Up</TextLink>
        </div>
    </form>
</div>