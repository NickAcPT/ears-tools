<script lang="ts">
    import { FeatureStatus, Protrusion, TailMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { getEarsFeatures, manipulatorWizardPageTitle } from "$lib/stores.svelte";
    import { toStore } from "svelte/store";

    $manipulatorWizardPageTitle = "Protrusions";

    let claws = toStore(
        () => (getEarsFeatures().protrusions.includes(Protrusion.Claws) ? FeatureStatus.Enabled : FeatureStatus.Disabled),
        (value) => {
            if (value === FeatureStatus.Enabled) {
                getEarsFeatures().protrusions.push(Protrusion.Claws);
            } else {
                const idx = getEarsFeatures().protrusions.indexOf(Protrusion.Claws);
                if (idx !== -1) {
                    getEarsFeatures().protrusions.splice(getEarsFeatures().protrusions.indexOf(Protrusion.Claws), 1);
                }
            }
        }
    );
    
    let horn = toStore(
        () => (getEarsFeatures().protrusions.includes(Protrusion.Horns) ? FeatureStatus.Enabled : FeatureStatus.Disabled),
        (value) => {
            if (value === FeatureStatus.Enabled) {
                getEarsFeatures().protrusions.push(Protrusion.Horns);
            } else {
                const idx = getEarsFeatures().protrusions.indexOf(Protrusion.Horns);
                if (idx !== -1) {
                    getEarsFeatures().protrusions.splice(getEarsFeatures().protrusions.indexOf(Protrusion.Horns), 1);
                }
            }
        }
    );
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
