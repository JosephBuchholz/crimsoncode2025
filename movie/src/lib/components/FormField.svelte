<script>
    import RequiredTag from "./RequiredTag.svelte";

    export let name;
    export let type;
    export let id;
    export let placeholder;
    export let required;
</script>

<div class="pb-2">
    <label for={name} class="block mb-2 text-sm font-medium text-[#111827]">
        <slot></slot>{#if required}<RequiredTag/>{/if}
    </label>
    <div class="relative text-gray-400">
        <span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
            <slot name="icon"></slot>
        </span>
        <input type={type} name={name} id={id} class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder={placeholder} autocomplete="off" required={required}>
    </div>
</div>