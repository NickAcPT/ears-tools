<script lang="ts">
    import { capeImage, chestSize, emissiveSkin } from "$lib/stores";
    import SkinDropZone from "../../SkinDropZone.svelte";

    async function handleCapeFile(e: CustomEvent<FileList>) {
        let files = e.detail;
        if (files.length !== 1) {
            console.error("Only one file can be uploaded");
            return;
        }

        let file = files[0];
        $capeImage = new Uint8Array(await file.arrayBuffer());
    }
</script>

<div>
    <h2 class="text-2xl">Cape</h2>
    <div class="flex h-min gap-2">
        <SkinDropZone on:files={handleCapeFile} offerDemoSkin={false}>
            <svelte:fragment slot="file">cape texture</svelte:fragment>
        </SkinDropZone>
        {#if $capeImage}
            <div class="flex-1">
                <!-- prettier-ignore -->
                <img class="h-full pixelated aspect-auto" src={URL.createObjectURL(new Blob([$capeImage], { type: "image/png" }))} alt="Cape texture" />
            </div>
        {/if}
    </div>
</div>
<div>
    <h2 class="text-2xl">Chest size</h2>
    <label for="chest-size">Chest Size</label>
    <input type="range" id="chest-size" min="0" max="1" step="0.1" bind:value={$chestSize} />
</div>

<div>
    <h2 class="text-2xl">Emissive</h2>
    <div class="flex flex-row items-center gap-2">
        <label for="chest-size">Emissive Skin</label>
        <input type="checkbox" id="emissive-skin" bind:checked={$emissiveSkin} />
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
