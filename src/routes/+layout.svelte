<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import Navbar from "../components/Navbar.svelte";
    import { base } from "$app/paths";
</script>

<svelte:head>
    {#if $page.data.title}
        <title>{$page.data.title} | Ears Tools by NickAc</title>
    {:else}
        <title>Ears Tools by NickAc</title>
    {/if}

    <meta property="og:title" content={$page.data.title ?? "Ears Tools"} />
    <meta
        property="og:description"
        content={$page.data.ogdescription ?? "Ears Tools is a set of small useful tools created for the Ears mod."}
    />
    <meta name="description" content={$page.data.ogdescription ?? "Ears Tools is a set of small useful tools created for the Ears mod."} />
    <meta property="og:site_name" content="Ears Tools by NickAc" />
    <meta name="keywords" content="NickAc, NickAcPT, nmsr, minecraft, skin, render, avatar, blockbench, ears, mod, erase, region, model, generator" />
    <meta property="og:image" content="{base}/favicon.png" />
    <meta name="theme-color" content="#0FCFF5" />
    <meta name="color-scheme" content="light dark" />
</svelte:head>

<Navbar />

<article>
    <slot />
</article>
