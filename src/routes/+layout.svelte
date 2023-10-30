<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import Navbar from "../components/Navbar.svelte";
</script>

<svelte:head>
    {#if $page.data.title}
        <title>{$page.data.title} | Ears Tools by NickAc</title>
    {:else}
        <title>Ears Tools by NickAc</title>
    {/if}
</svelte:head>

<Navbar class="mx-auto max-w-[95%] lg:max-w-[85%]" />

<article>
    <slot />
</article>
