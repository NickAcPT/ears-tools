<script lang="ts">
    import type { AlfalfaEntry } from "$lib/alfalfa-inspector";
    import { createEventDispatcher } from "svelte";
    import DownloadIcon from "../icons/DownloadIcon.svelte";
    import UploadIcon from "../icons/UploadIcon.svelte";
    import DeleteIcon from "../icons/DeleteIcon.svelte";
    import AlfalfaDataView from "./AlfalfaDataView.svelte";

    export let entry: AlfalfaEntry;
    
    let dispatcher = createEventDispatcher();
    
</script>

<div class="entry">
    <p>{entry.key}</p>
    <div>
        <AlfalfaDataView data={entry.value} />
    </div>

    <div class="flex gap-2">
        <button on:click={() => dispatcher("download", entry)}><DownloadIcon class="h-5" /></button>
        <button on:click={() => dispatcher("upload", entry)}><UploadIcon class="h-5" /></button>
        <button on:click={() => dispatcher("delete", entry)}><DeleteIcon class="h-5" /></button>
    </div>
</div>


<style lang="postcss">
    .entry {
        @apply contents;
    }
    
    button {
        @apply flex-1 flex justify-center;
    }
</style>