<script lang="ts">
    import type { AlfalfaImageEntryData } from "$lib/alfalfa-inspector.svelte";

    export let data: AlfalfaImageEntryData;
    
    $: blob = new Blob([data.value], { type: "image/png" });
</script>

<img src={URL.createObjectURL(blob)} alt="Stored data" class="h-20 pixelated" />