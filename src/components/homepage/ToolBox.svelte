<script lang="ts">
    import type { SvelteComponent } from "svelte";

    export let icon: typeof SvelteComponent;
    export let name: string;
    export let description: string[] | undefined = undefined;
    export let ghost: boolean = false;
</script>

<div
    class:ghost
    class="shadow-md h-full min-h-[10em] p-4 rounded-lg bg-primary-500 flex flex-col text-background hover:bg-primary-800 hover:shadow-lg"
>
    <div class="flex flex-col items-center gap-2">
        <svelte:component this={icon} class="h-10" />
        <h2 class="text-left text-xl font-medium pb-1">{name}</h2>
    </div>
    {#if description}
        {#each description as desc}
            <p class="text-center">{desc}</p>
        {/each}
    {/if}
</div>

<style lang="postcss">
    .ghost {
        @apply bg-gray-600/10 text-text border-2 border-gray-400/20 border-dashed;
    }
</style>