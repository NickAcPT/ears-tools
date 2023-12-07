<script lang="ts">
    import { FeatureStatus, WingsAnimations, WingsMode } from "$lib/ears-manipulator";
    import { writable } from "svelte/store";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { snout, snoutWidth, snoutHeight, snoutLength, snoutOffset, wingsMode, wingsAnimations } from "$lib/stores";
</script>

<h2 class="text-2xl">Wings</h2>
<div>
    <h3 class="text-xl">Mode</h3>
    <ManipulatorEnumPicker let:element elements={WingsMode} kind="wings-mode" value={wingsMode} class="py-4">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>
<div>
    <h3 class="text-xl">Animations</h3>
    <ManipulatorEnumPicker let:element elements={WingsAnimations} kind="wings-animations" value={wingsAnimations} class="py-4">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
