<script lang="ts">
    import { Protrusion, TailMode } from "$lib/ears-manipulator";
    import { writable } from "svelte/store";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";

    let tailMode = writable(TailMode.None);
    let protrusions = writable([] as Protrusion[]);
</script>

<div>
    <h2 class="text-2xl">Tail Mode</h2>
    <ManipulatorEnumPicker let:element elements={TailMode} kind="tail-mode" value={tailMode} class="px-10 py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div>
    <h2 class="text-2xl">Protrusions</h2>
    <ManipulatorEnumPicker let:element elements={Protrusion} kind="protrusion" value={protrusions} class="py-5">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<p>Mode: {TailMode[$tailMode]}</p>
<p>Protrusions: {$protrusions.map((p) => Protrusion[p]).join(", ")}</p>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
