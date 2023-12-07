<script lang="ts">
    import { capeImage, chestSize } from "$lib/stores";
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
    <SkinDropZone on:files={handleCapeFile} offerDemoSkin={false}>
        <svelte:fragment slot="file">cape texture</svelte:fragment>
    </SkinDropZone>
</div>
<div>
    <h2 class="text-2xl">Chest size</h2>
    <label for="chest-size">Chest Size</label>
    <input type="range" id="chest-size" min="0" max="1" step="0.1" bind:value={$chestSize} />
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
