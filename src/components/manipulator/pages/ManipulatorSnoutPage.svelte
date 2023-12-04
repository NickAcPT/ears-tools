<script lang="ts">
    import { SnoutStatus } from "$lib/ears-manipulator";
    import { writable } from "svelte/store";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";

    let snout = writable(SnoutStatus.Disabled);
    let snoutWidth = writable(1);
    let snoutHeight = writable(1);
    let snoutOffset = writable(0);
    let snoutLength = writable(1);
</script>

<div>
    <h2 class="text-2xl">Snout</h2>
    <ManipulatorEnumPicker let:element elements={SnoutStatus} kind="tail-mode" value={snout} class="px-10 py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div>
    <div>
        <label for="snout-width">Width</label>
        <input type="range" id="snout-width" min="1" max="7" step="1" bind:value={$snoutWidth} />
    </div>
    <div>
        <label for="snout-offset">Offset</label>
        <input type="range" id="snout-offset" min="0" max="8" step="1" bind:value={$snoutOffset} />
    </div>
    <div>
        <label for="snout-height">Height</label>
        <input type="range" id="snout-height" min="1" max="4" step="1" bind:value={$snoutHeight} />
    </div>
    <div>
        <label for="snout-length">Length</label>
        <input type="range" id="snout-length" min="1" max="6" step="1" bind:value={$snoutLength} />
    </div>
</div>

<p>Status: {SnoutStatus[$snout]}</p>
<p>Width: {$snoutWidth}</p>
<p>Height: {$snoutHeight}</p>
<p>Length: {$snoutLength}</p>
<p>Offset: {$snoutOffset}</p>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
