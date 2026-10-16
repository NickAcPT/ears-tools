<script lang="ts">
    import { WingsAnimations, WingsMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { wingsMode, wingsAnimations, wingsImage, wingsSampleMode } from "$lib/stores";
    import SkinDropZone from "../../SkinDropZone.svelte";
    import { get_template_wings } from "../../../tools/ears-manipulator/ears_manipulator";

    let isSample = false;

    async function handleWingFile(e: CustomEvent<FileList>) {
        let files = e.detail;
        if (files.length !== 1) {
            console.error("Only one file can be uploaded");
            return;
        }

        const sample = isSample;
        isSample = false;

        let file = files[0];
        $wingsImage = new Uint8Array(await file.arrayBuffer());
        $wingsSampleMode = sample ? $wingsMode : null;
    }

    function handleSampleWings(e: CustomEvent<{ replace: (wings: BlobPart) => void }>) {
        e.preventDefault();
        isSample = true;
        e.detail.replace(get_template_wings($wingsMode));
    }

    // The sample is laid out for the wings mode (asymmetric wings use one half each), so it follows mode changes
    $: if ($wingsSampleMode !== null && $wingsSampleMode !== $wingsMode) {
        $wingsImage = get_template_wings($wingsMode);
        $wingsSampleMode = $wingsMode;
    }
</script>

<h2 class="text-2xl">Wings</h2>
<div>
    <h3 class="text-xl">Mode</h3>
    <ManipulatorEnumPicker elements={WingsMode} kind="wings-mode" value={wingsMode} class="py-4" preview />
</div>
<div>
    <h3 class="text-xl">Animations</h3>
    <ManipulatorEnumPicker elements={WingsAnimations} kind="wings-animations" value={wingsAnimations} class="py-4" />
</div>

<div>
    <h3 class="text-xl">File</h3>
    <p>Must be 20x16 or 12x12</p>
    
    <div class="flex h-min gap-2">
        <SkinDropZone on:files={handleWingFile} on:offerDemoSkin={handleSampleWings}>
            <svelte:fragment slot="file">wing texture</svelte:fragment>
            <svelte:fragment slot="demo">sample wing texture</svelte:fragment>
        </SkinDropZone>
        
        {#if $wingsImage}
            <div class="flex flex-1 items-start gap-2">
                <!-- prettier-ignore -->
                <img class="h-full pixelated aspect-auto" src={URL.createObjectURL(new Blob([$wingsImage], { type: "image/png" }))} alt="Wings texture" />
                <button class="mt-2" on:click={() => { $wingsImage = undefined; $wingsSampleMode = null; }}>Remove</button>
            </div>
        {/if}
    </div>
</div>
