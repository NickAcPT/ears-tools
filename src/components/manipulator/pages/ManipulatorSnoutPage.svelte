<script lang="ts">
    import { FeatureStatus } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { manipulatorWizardPageTitle, snout, snoutWidth, snoutHeight, snoutLength, snoutOffset } from "$lib/stores.svelte";

    $manipulatorWizardPageTitle = "Snout";
</script>

<div>
    <ManipulatorEnumPicker let:element elements={FeatureStatus} kind="snout-mode" value={snout} class="px-10 py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div class="grid grid-cols-2 justify-items-center">
    <div>
        <label for="snout-width">Width</label>
        <input type="range" id="snout-width" min="1" max="7" step="1" bind:value={$snoutWidth} />
    </div>
    <div>
        <label for="snout-height">Height</label>
        <input type="range" id="snout-height" min="1" max="4" step="1" bind:value={$snoutHeight} />
    </div>
    <div>
        <label for="snout-offset">Offset</label>
        <input type="range" id="snout-offset" min="0" max="8" step="1" bind:value={$snoutOffset} />
    </div>
    <div>
        <label for="snout-length">Length</label>
        <input type="range" id="snout-length" min="1" max="6" step="1" bind:value={$snoutLength} />
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
