<svelte:options runes />

<script lang="ts">
    import type { AlfalfaEntryData } from "$lib/alfalfa-inspector.svelte";
    import AlfalfaBinaryDataView from "./AlfalfaBinaryDataView.svelte";
    import AlfalfaEraseDataView from "./AlfalfaEraseDataView.svelte";
    import AlfaflaImageDataView from "./AlfalfaImageDataView.svelte";

    let { data } = $props<{ data: AlfalfaEntryData }>();
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
