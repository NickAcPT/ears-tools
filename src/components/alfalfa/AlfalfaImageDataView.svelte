<script lang="ts">
    import type { AlfalfaImageEntryData } from "$lib/alfalfa-inspector";

    export let data: AlfalfaImageEntryData;
    
    $: blob = new Blob([new Uint8Array(data.value)], { type: "image/png" });
</script>

<img src={URL.createObjectURL(blob)} alt="Stored data" class="h-20 pixelated" />