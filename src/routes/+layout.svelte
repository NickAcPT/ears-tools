<script lang="ts">
    import { page } from "$app/stores";
    import "../app.css";
    import Navbar from "../components/Navbar.svelte";
    export const ssr = true;
    export const prerender = true;
</script>

<svelte:head>
    {#if $page.data.title}
        <title>{$page.data.title} | Ears Tools by NickAc</title>
    {:else}
        <title>Ears Tools by NickAc</title>
    {/if}
</svelte:head>

<Navbar class="mx-auto max-w-[95%] lg:max-w-[85%]" />

<article class="mx-auto max-w-[95%] lg:max-w-[85%]">
    <slot />
</article>
