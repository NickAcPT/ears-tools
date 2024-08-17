<svelte:options runes />

<script lang="ts">
    import { WingsAnimations, WingsMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { currentEarsFeatures, getEarsFeatures } from "$lib/stores.svelte";
    import SkinDropZone from "../../SkinDropZone.svelte";

    async function handleWingFile(e: CustomEvent<FileList>) {
        let files = e.detail;
        if (files.length !== 1) {
            console.error("Only one file can be uploaded");
            return;
        }
        
        let file = files[0];
        getEarsFeatures().wings.wings = new Uint8Array(await file.arrayBuffer());
    }
</script>

<h2 class="text-2xl">Wings</h2>
<div>
    <h3 class="text-xl">Mode</h3>
    <ManipulatorEnumPicker elements={WingsMode} kind="wings-mode" bind:value={currentEarsFeatures.current.wings.mode} class="py-4">
        {#snippet children(element)}
            <canvas class="flex-1" width="96" height="96"></canvas>
            {element}
        {/snippet}
    </ManipulatorEnumPicker>
</div>
<div>
    <h3 class="text-xl">Animations</h3>
    <ManipulatorEnumPicker elements={WingsAnimations} kind="wings-animations" bind:value={currentEarsFeatures.current.wings.animations} class="py-4">
        {#snippet children(element)}
            <canvas class="flex-1" width="96" height="96"></canvas>
            {element}
        {/snippet}
    </ManipulatorEnumPicker>
</div>

<div>
    <h3 class="text-xl">File</h3>
    <p>Must be 20x16 or 12x12</p>
    
    <div class="flex h-min gap-2">
        <SkinDropZone onfiles={handleWingFile} offerDemoSkin={false}>
            {#snippet file()}wing texture{/snippet}
        </SkinDropZone>
        
        {#if getEarsFeatures().wings.wings}
            <div class="flex flex-1 items-start gap-2">
                <!-- prettier-ignore -->
                <img class="h-full pixelated aspect-auto" src={URL.createObjectURL(new Blob([getEarsFeatures().wings.wings!], { type: "image/png" }))} alt="Cape texture" />
                <button class="mt-2" onclick={() => getEarsFeatures().wings.wings = undefined}>Remove</button>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
