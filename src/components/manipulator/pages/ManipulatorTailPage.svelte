<script lang="ts">
    import { TailMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { tailMode, tailBends, tailSegments, manipulatorWizardPageTitle } from "$lib/stores";
    
    $manipulatorWizardPageTitle = "Tail";
</script>

<div>
    <h3 class="text-xl">Mode</h3>
    <ManipulatorEnumPicker let:element elements={TailMode} kind="tail-mode" value={tailMode} class="px-10 py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div>
    <label for="tail-segment-count" class="block text-xl">Tail Segments</label>
    <input type="range" id="tail-segment-count" min="1" max="4" step="1" bind:value={$tailSegments} />
</div>
<div>
    <h3 class="text-xl">Bends</h3>

    <div class="grid grid-cols-2 justify-items-center">
        {#each $tailBends as bend, i}
            <div>
                <label for="tail-bend-{i}">Bend {i + 1}</label>
                <input type="range" id="tail-bend-{i}" min="-90" max="90" step="15" bind:value={bend} disabled={i >= $tailSegments} />
            </div>
        {/each}
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
