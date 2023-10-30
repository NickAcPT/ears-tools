<script lang="ts">
    import { page } from "$app/stores";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
</script>

<div class="pb-10">
    <h1 class="text-3xl text-center">{$page.data.title}</h1>
    {#if $page.data.description}
        <h2 class="text-center">{$page.data.description}</h2>
    {/if}
</div>

<slot />
