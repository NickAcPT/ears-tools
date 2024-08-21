<svelte:options runes />

<script lang="ts">
    import type { AlfalfaImageEntryData } from "$lib/alfalfa-inspector.svelte";

    let data: AlfalfaImageEntryData = $props<{ data: AlfalfaImageEntryData }>();

    let blob = $derived(new Blob([data.value], { type: "image/png" }));
</script>

<img src={URL.createObjectURL(blob)} alt="Stored data" class="pixelated h-20" />
