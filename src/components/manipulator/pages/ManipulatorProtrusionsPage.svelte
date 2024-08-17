<script lang="ts">
    import { FeatureStatus, Protrusion, TailMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { horn, claws, manipulatorWizardPageTitle } from "$lib/stores.svelte";

    $manipulatorWizardPageTitle = "Protrusions";
</script>

<div>
    <h2 class="text-2xl">Claws</h2>
    <ManipulatorEnumPicker let:element elements={FeatureStatus} kind="protrusion-claws" value={claws} class="py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div>
    <h2 class="text-2xl">Horn</h2>
    <ManipulatorEnumPicker let:element elements={FeatureStatus} kind="protrusion-horn" value={horn} class="py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
