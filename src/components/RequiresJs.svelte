<svelte:options runes />

<script lang="ts">
    import type { Snippet } from "svelte";

    let { children } = $props<{ children: Snippet }>();
</script>

<svelte:head>
    <noscript>
        <style>
            .requires-js {
                display: none !important;
            }
        </style>
    </noscript>
</svelte:head>

<div class="requires-js" style:display="contents">
    {@render children()}
</div>

<style>
</style>
