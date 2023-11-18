<script lang="ts">
    import RequiresJs from "./RequiresJs.svelte";

    export let init: () => Promise<void>;
</script>

<RequiresJs>
    {#await init()}
        <p class="text-center">Loading...</p>
    {:then}
        <slot />
    {:catch error}
        <div class="relative left-0 my-5 flex w-full flex-col items-center gap-2 border-y-2 border-gray-400 bg-red-500/10 p-2">
            <p class="p-2 text-center text-xl">It seems like your browser doesn't support WebAssembly</p>
            <p>Please check if you have a recent version of your browser, and if you do, please contact @nickac on Discord.</p>
            <p>Error: {error.message}</p>
        </div>
    {/await}
</RequiresJs>