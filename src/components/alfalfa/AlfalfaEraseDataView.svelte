<svelte:options runes />

<script lang="ts">
    import type { AlfalfaEraseEntryData } from "$lib/alfalfa-inspector.svelte";
    
    let data: AlfalfaEraseEntryData = $props<{ data: AlfalfaEraseEntryData }>();
</script>

<div class="grid auto-rows-auto">
    {#each data.value as region}
        <p>
            Erase region: {region.x}, {region.y}, {region.width}, {region.height}
        </p>
    {/each}
</div>
