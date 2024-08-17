<script lang="ts">
    import { EarsAnchor, EarsMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { currentEarsFeatures, getEarsFeatures, manipulatorWizardPageTitle } from "$lib/stores.svelte";

    $manipulatorWizardPageTitle = "Ears";
</script>

<div class="flex flex-col gap-4">
    <div>
        <h2 class="text-xl">Anchor</h2>
        <ManipulatorEnumPicker
            elements={EarsAnchor}
            kind="ears-anchor"
            bind:value={currentEarsFeatures.current.ears.anchor}
            class="px-10 py-4"
        />
    </div>

    <div>
        <h2 class="text-xl">Mode</h2>
        <ManipulatorEnumPicker elements={EarsMode} kind="ears-mode" bind:value={currentEarsFeatures.current.ears.mode} class="py-4">
            {#snippet children(element)}
                <canvas class="flex-1" width="96" height="96"></canvas>
                {element}
            {/snippet}
        </ManipulatorEnumPicker>
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
