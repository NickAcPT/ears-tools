<script lang="ts">
    import type { AlfalfaEntryData } from "$lib/alfalfa-inspector";
    import AlfalfaBinaryDataView from "./AlfalfaBinaryDataView.svelte";
    import AlfalfaEraseDataView from "./AlfalfaEraseDataView.svelte";
    import AlfaflaImageDataView from "./AlfalfaImageDataView.svelte";

    export let data: AlfalfaEntryData;
</script>

{#if data.type == "binary"}
    <AlfalfaBinaryDataView {data} />
{:else if data.type == "erase"}
    <AlfalfaEraseDataView {data} />
{:else if data.type == "image"}
    <AlfaflaImageDataView {data} />
{:else}
    <p>Unknown data type: {data}</p>
{/if}