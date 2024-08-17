<script lang="ts">
    import { EarsAnchor, EarsMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { getEarsFeatures, manipulatorWizardPageTitle, } from "$lib/stores.svelte";

    $manipulatorWizardPageTitle = "Ears";
</script>

<div class="flex flex-col gap-4">
    <div>
        <h2 class="text-xl">Anchor</h2>
        <ManipulatorEnumPicker elements={EarsAnchor} kind="ears-anchor" value={getEarsFeatures().ears.anchor} class="px-10 py-4" />
    </div>
    
    <div>
        <h2 class="text-xl">Mode</h2>
        <ManipulatorEnumPicker let:element elements={EarsMode} kind="ears-mode" value={getEarsFeatures().ears.mode} class="py-4">
            <canvas class="flex-1" width="96" height="96"></canvas>
            {element}
        </ManipulatorEnumPicker>
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
