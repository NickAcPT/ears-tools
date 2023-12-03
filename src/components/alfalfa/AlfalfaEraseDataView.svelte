<script lang="ts">
    import type { AlfalfaEraseEntryData } from "$lib/alfalfa-inspector";
    export let data: AlfalfaEraseEntryData;
</script>

<div class="grid auto-rows-auto">
    {#each data.value as region}
        <p>
            Erase region: {region.x}, {region.y}, {region.width}, {region.height}
        </p>
    {/each}
</div>
