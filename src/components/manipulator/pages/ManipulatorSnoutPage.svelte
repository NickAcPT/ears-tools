<script lang="ts">
    import { FeatureStatus } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { manipulatorWizardPageTitle, getEarsFeatures, DEFAULT_SNOUT_SETTINGS, currentEarsFeatures } from "$lib/stores.svelte";
    import { toStore } from "svelte/store";

    $manipulatorWizardPageTitle = "Snout";
    
    let snout = toStore(
        () => (getEarsFeatures().snout != undefined ? FeatureStatus.Enabled : FeatureStatus.Disabled),
        (value) => {
            if (value === FeatureStatus.Enabled) {
                getEarsFeatures().snout = DEFAULT_SNOUT_SETTINGS;
            } else {
                getEarsFeatures().snout = undefined;
            }
        }
    );
</script>

<div>
    <ManipulatorEnumPicker let:element elements={FeatureStatus} kind="snout-mode" value={snout} class="px-10 py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

{#if snout}
    
<div class="grid grid-cols-2 justify-items-center">
    <div>
        <label for="snout-width">Width</label>
        <input type="range" id="snout-width" min="1" max="7" step="1" bind:value={currentEarsFeatures.current.snout!.width} />
    </div>
    <div>
        <label for="snout-height">Height</label>
        <input type="range" id="snout-height" min="1" max="4" step="1" bind:value={currentEarsFeatures.current.snout!.height} />
    </div>
    <div>
        <label for="snout-offset">Offset</label>
        <input type="range" id="snout-offset" min="0" max="8" step="1" bind:value={currentEarsFeatures.current.snout!.offset} />
    </div>
    <div>
        <label for="snout-length">Length</label>
        <input type="range" id="snout-length" min="1" max="6" step="1" bind:value={currentEarsFeatures.current.snout!.length} />
    </div>
</div>
{/if}

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
