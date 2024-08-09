<svelte:options runes />

<script lang="ts">
    import { page } from "$app/stores";
    import type { Snippet } from "svelte";

    let { children } = $props<{ children: Snippet }>();
</script>

{#if !$page.data.noDescription}
    <div class="pb-10">
        <h1 class="text-center text-3xl">{$page.data.title}</h1>
        {#if $page.data.description}
            <h2 class="text-center">{$page.data.description}</h2>
        {/if}
    </div>
{/if}

<noscript>
    <div class="relative left-0 my-5 flex w-full flex-col items-center gap-2 border-y-2 border-gray-400 bg-red-500/10 p-2">
        <p class="p-2 text-center text-xl">It seems like your browser doesn't support JavaScript</p>
        <p>Not supporting JavaScript is okay, but you'll have to enable it if you expect this tool to work.</p>
    </div>
</noscript>

{@render children()}