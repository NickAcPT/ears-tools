<script lang="ts">
    import type { SvelteComponent } from "svelte";

    export let icon: typeof SvelteComponent<any>;
    export let name: string;
    export let description: string[] | undefined = undefined;
    export let ghost: boolean = false;
</script>

<div class="toolbox-outer button" class:ghost>
    <div class="flex items-center gap-2">
        <svelte:component this={icon} class="h-10" />
        <h2 class="pb-1 text-left text-xl font-medium">{name}</h2>
    </div>
    {#if description}
        {#each description as desc}
            <p class="text-center">{desc}</p>
        {/each}
    {/if}
</div>

<style lang="postcss">
    .ghost {
        @apply !border-2 !border-dashed !border-gray-400/20 !bg-gray-600/10 !text-text;
    }

    .toolbox-outer {
        @apply flex h-full min-h-[10em] flex-col items-center justify-around p-4;
    }
</style>
