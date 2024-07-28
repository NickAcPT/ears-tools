<script lang="ts">
    import type { SvelteComponent } from "svelte";

    export let icon: typeof SvelteComponent<any>;
    export let name: string;
    export let description: string[] | undefined = undefined;
    export let ghost: boolean = false;
    export let wip: boolean = false;
</script>

<div class="toolbox-outer button relative" class:ghost>
    <div class="flex items-center gap-2">
        <svelte:component this={icon} class="h-10" />
        <h2 class="pb-1 text-left text-xl font-medium">{name}</h2>
    </div>
    {#if wip}
        <div class="ribbon right-0 flex items-center gap-1 text-text-on-primary-inverse">
            <span class="text-xs font-medium">WIP</span>
            <span class="text-xs font-medium">🚧</span>
        </div>
    {/if}
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

    /* From https://css-generators.com/ribbon-shapes/ */
    
    .ribbon {
        --f: 0.5em; /* control the folded part */

        @apply absolute top-0 right-0 bg-accent-700;
        
        padding-inline: 1lh;
        padding-bottom: var(--f);
        border-image: conic-gradient(#0008 0 0) 51% / var(--f);
        clip-path: polygon(
            100% calc(100% - var(--f)),
            100% 100%,
            calc(100% - var(--f)) calc(100% - var(--f)),
            var(--f) calc(100% - var(--f)),
            0 100%,
            0 calc(100% - var(--f)),
            999px calc(100% - var(--f) - 999px),
            calc(100% - 999px) calc(100% - var(--f) - 999px)
        );
        transform: translate(calc((1 - cos(45deg)) * 100%), -100%) rotate(45deg);
        transform-origin: 0% 100%;
    }
</style>
