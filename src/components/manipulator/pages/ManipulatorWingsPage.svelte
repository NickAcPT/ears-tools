<script lang="ts">
    import { WingsAnimations, WingsMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { wingsMode, wingsAnimations, wingsImage } from "$lib/stores.svelte";
    import SkinDropZone from "../../SkinDropZone.svelte";

    async function handleWingFile(e: CustomEvent<FileList>) {
        let files = e.detail;
        if (files.length !== 1) {
            console.error("Only one file can be uploaded");
            return;
        }
        
        let file = files[0];
        $wingsImage = new Uint8Array(await file.arrayBuffer());
    }
</script>

<h2 class="text-2xl">Wings</h2>
<div>
    <h3 class="text-xl">Mode</h3>
    <ManipulatorEnumPicker let:element elements={WingsMode} kind="wings-mode" value={wingsMode} class="py-4">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>
<div>
    <h3 class="text-xl">Animations</h3>
    <ManipulatorEnumPicker let:element elements={WingsAnimations} kind="wings-animations" value={wingsAnimations} class="py-4">
        <canvas class="flex-1" width="96" height="96"></canvas>
        {element}
    </ManipulatorEnumPicker>
</div>

<div>
    <h3 class="text-xl">File</h3>
    <p>Must be 20x16 or 12x12</p>
    
    <div class="flex h-min gap-2">
        <SkinDropZone on:files={handleWingFile} offerDemoSkin={false}>
            <svelte:fragment slot="file">wing texture</svelte:fragment>
        </SkinDropZone>
        
        {#if $wingsImage}
            <div class="flex flex-1 items-start gap-2">
                <!-- prettier-ignore -->
                <img class="h-full pixelated aspect-auto" src={URL.createObjectURL(new Blob([$wingsImage], { type: "image/png" }))} alt="Cape texture" />
                <button class="mt-2" on:click={() => $wingsImage = undefined}>Remove</button>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
