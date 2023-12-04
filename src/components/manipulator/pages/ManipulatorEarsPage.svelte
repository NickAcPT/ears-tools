<script lang="ts">
    import { EarsAnchor, EarsMode, SnoutStatus } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { earsAnchor, earsMode, snout, snoutWidth, snoutHeight, snoutLength, snoutOffset } from "$lib/stores";
</script>

<h1 class="text-2xl">Ears</h1>
<div>
    <h2 class="text-xl">Anchor</h2>
    <ManipulatorEnumPicker elements={EarsAnchor} kind="ears-anchor" value={earsAnchor} class="px-10 py-4" />
</div>

<div>
    <h2 class="text-xl">Mode</h2>
    <ManipulatorEnumPicker let:element elements={EarsMode} kind="ears-mode" value={earsMode} class="py-4">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div>
    <h2 class="text-2xl">Snout</h2>
    <ManipulatorEnumPicker let:element elements={SnoutStatus} kind="snout-mode" value={snout} class="px-10 py-5">
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

<div class="grid grid-cols-3">
    <p>Snout Status: {SnoutStatus[$snout]}</p>
    <p>Snout Width: {$snoutWidth}</p>
    <p>Snout Height: {$snoutHeight}</p>
    <p>Snout Length: {$snoutLength}</p>
    <p>Snout Offset: {$snoutOffset}</p>

    <p>Anchor: {EarsAnchor[$earsAnchor]}</p>
    <p>Mode: {EarsMode[$earsMode]}</p>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
