<svelte:options runes />

<script lang="ts">
    import type { AlfalfaEntry } from "$lib/alfalfa-inspector.svelte";
    import { createEventDispatcher } from "svelte";
    import DownloadIcon from "../icons/DownloadIcon.svelte";
    import UploadIcon from "../icons/UploadIcon.svelte";
    import DeleteIcon from "../icons/DeleteIcon.svelte";
    import AlfalfaDataView from "./AlfalfaDataView.svelte";
    import EraserIcon from "../icons/EraserIcon.svelte";

    interface AlfalfaEntryRowProps {
        entry: AlfalfaEntry;
        onDownload: (entry: CustomEvent<AlfalfaEntry>) => void;
        onUpload: (entry: CustomEvent<AlfalfaEntry>) => void;
        onDelete: (entry: CustomEvent<AlfalfaEntry>) => void;
        onEraserTool: (entry: CustomEvent<AlfalfaEntry>) => void;
    }

    let { entry, onDownload, onUpload, onDelete, onEraserTool }: AlfalfaEntryRowProps = $props();
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
            <button onclick={() => onDownload?.(new CustomEvent("", { detail: entry }))}><DownloadIcon class="h-5" />Download</button>
            <button onclick={() => onUpload?.(new CustomEvent("", { detail: entry }))}><UploadIcon class="h-5" />Upload</button>
        {:else}
            <button onclick={() => onEraserTool?.(new CustomEvent("", { detail: entry }))}>
                <EraserIcon class="h-5" />Open in Eraser Tool
            </button>
        {/if}
        <button onclick={() => onDelete?.(new CustomEvent("", { detail: entry }))}><DeleteIcon class="h-5" /> Delete</button>
    </div>
</div>

<style lang="postcss">
    button {
        @apply flex h-full flex-1 items-center justify-center;
    }
</style>
