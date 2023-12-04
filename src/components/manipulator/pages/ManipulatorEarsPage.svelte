<script lang="ts">
    import { EarsAnchor, EarsMode } from "$lib/ears-manipulator";
    import { writable } from "svelte/store";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";

    let earsAnchor = writable(EarsAnchor.Center);
    let earsMode = writable(EarsMode.None);
</script>

<h1>Page 2</h1>

<h1 class="text-2xl">Ears</h1>
<div>
    <h2 class="text-xl">Anchor</h2>
    <ManipulatorEnumPicker elements={EarsAnchor} kind="ears-anchor" value={earsAnchor} class=" py-4 px-10" />
</div>

<div>
    <h2 class="text-xl">Anchor</h2>
    <ManipulatorEnumPicker let:element elements={EarsMode} kind="ears-mode" value={earsMode} class="py-4">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<p>{EarsAnchor[$earsAnchor]}</p>
<p>{EarsMode[$earsMode]}</p>

<style lang="postcss">
    canvas {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC');
    }
</style>
