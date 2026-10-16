<script lang="ts">
    import {
        earsFeatures,
        manipulatorOutSkinFile,
        manipulatorPreviewSource,
        manipulatorSkinIsGeneratedTemplate,
        originalManipulatorSkinFile,
        manipulatorSkinSlimModel,
        setEarsFeatures,
    } from "$lib/stores";
    import { captureManipulatorPreviewSource } from "$lib/manipulator-previews";
    import { createEventDispatcher } from "svelte";
    import SkinDropZone from "../../SkinDropZone.svelte";
    import NickAc from "../../homepage/NickAc.svelte";
    import { get_ears_features, get_template_skin } from "../../../tools/ears-manipulator/ears_manipulator";

    const dispatcher = createEventDispatcher();

    let isDemoTemplate = false;

    async function handleFiles(e: CustomEvent<FileList>) {
        const list = e.detail;

        if (list.length !== 1) {
            console.error("Only one file can be uploaded at a time.", list.length);
            return;
        }

        const isDemoSkin = isDemoTemplate;
        isDemoTemplate = false;

        const file = list[0];
        $manipulatorOutSkinFile = file;
        $originalManipulatorSkinFile = file;

        const skin = new Uint8Array(await file.arrayBuffer());
        try {
            const features = await get_ears_features(skin);
            console.log("Updating features from skin", features);

            setEarsFeatures(features);
            $manipulatorSkinIsGeneratedTemplate = isDemoSkin;
        } catch (e: any) {
            console.error(e);
        }

        $manipulatorPreviewSource = captureManipulatorPreviewSource(skin);

        dispatcher("next");
    }

    function handleDemoSkinTemplate(e: CustomEvent<{ replace: (skin: BlobPart) => void; }>): void {
        e.preventDefault();
        console.log("Generating demo template skin", {
            slimArms: $manipulatorSkinSlimModel,
            features: $earsFeatures,
        });
        const skin = get_template_skin($earsFeatures, $manipulatorSkinSlimModel);
        console.log("Generated demo template skin", {
            slimArms: $manipulatorSkinSlimModel,
            byteLength: skin.byteLength,
        });
        isDemoTemplate = true;
        e.detail.replace(skin);
    }
</script>

<div class="flex h-full flex-col items-center gap-10">
    <h1 class="text-3xl">Welcome to <NickAc />'s Ears Manipulator!</h1>
    <div class="flex flex-col justify-center gap-4 text-center">
        <p>Let's get started by selecting a skin or picking a template skin.</p>
        <SkinDropZone on:offerDemoSkin={handleDemoSkinTemplate} on:files={handleFiles} slimArms={manipulatorSkinSlimModel} />
    </div>
</div>
