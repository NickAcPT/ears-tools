<script lang="ts">
    import type { AlfalfaEntry } from "$lib/alfalfa-inspector.svelte";
    import { createEventDispatcher } from "svelte";
    import DownloadIcon from "../icons/DownloadIcon.svelte";
    import UploadIcon from "../icons/UploadIcon.svelte";
    import DeleteIcon from "../icons/DeleteIcon.svelte";
    import AlfalfaDataView from "./AlfalfaDataView.svelte";
    import EraserIcon from "../icons/EraserIcon.svelte";

    export let entry: AlfalfaEntry;

    let dispatcher = createEventDispatcher();
</script>

<div class="grid grid-cols-[1fr_2fr_1fr] items-center justify-center">
    <div>
        <p>{entry.key}</p>
    </div>
    <div class="flex items-center justify-center">
        <AlfalfaDataView data={entry.value} />
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] items-center gap-2">
        {#if entry.value.type !== "erase"}
            <button on:click={() => dispatcher("download", entry)}><DownloadIcon class="h-5" />Download</button>
            <button on:click={() => dispatcher("upload", entry)}><UploadIcon class="h-5" />Upload</button>
        {:else}
            <button on:click={() => dispatcher("eraser-tool", entry)}><EraserIcon class="h-5" />Open in Eraser Tool</button>
        {/if}
        <button on:click={() => dispatcher("delete", entry)}><DeleteIcon class="h-5" /> Delete</button>
    </div>
</div>

<style lang="postcss">
    button {
        @apply flex flex-1 items-center justify-center h-full;
    }
</style>
