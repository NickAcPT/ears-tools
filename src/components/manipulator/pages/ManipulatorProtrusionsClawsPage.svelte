<script lang="ts">
    import { FeatureStatus, Protrusion, TailMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { claws, manipulatorWizardPageTitle } from "$lib/stores";
    
    $manipulatorWizardPageTitle = "Protrusions - Claws"
</script>

<ManipulatorEnumPicker let:element elements={FeatureStatus} kind="protrusion" value={claws} class="py-5">
    <canvas class="flex-1" width="96" height="96"></canvas>
    {element}
</ManipulatorEnumPicker>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
