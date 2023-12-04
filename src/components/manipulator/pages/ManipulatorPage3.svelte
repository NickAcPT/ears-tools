<script lang="ts">
    import { Protrusion, TailMode } from "$lib/ears-manipulator";
    import { writable } from "svelte/store";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";

    let tailMode = writable(TailMode.None);
    let protrusions = writable([] as Protrusion[]);
</script>

<h1>Page 3</h1>
<div>
    <h2 class="text-xl">Tail</h2>
    <ManipulatorEnumPicker let:element elements={TailMode} kind="tail-mode" value={tailMode} class=" px-10 py-4">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div>
    <h2 class="text-xl">Protrusions</h2>
    <ManipulatorEnumPicker let:element elements={Protrusion} kind="protrusion" value={protrusions} class="py-4">
        
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<p>{TailMode[$tailMode]}</p>
<p>{$protrusions}</p>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
