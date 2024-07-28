<script lang="ts">
    import { manipulatorSkinFile, manipulatorSkinSlimModel, setEarsFeatures } from "$lib/stores";
    import { createEventDispatcher } from "svelte";
    import SkinDropZone from "../../SkinDropZone.svelte";
    import NickAc from "../../homepage/NickAc.svelte";
    import { get_ears_features } from "../../../tools/ears-manipulator/ears_manipulator";

    const dispatcher = createEventDispatcher();

    async function handleFiles(e: CustomEvent<FileList>) {
        const list = e.detail;

        if (list.length !== 1) {
            console.error("Only one file can be uploaded at a time.");
            return;
        }

        const file = list[0];
        $manipulatorSkinFile = file;

        try {
            const features = await get_ears_features(new Uint8Array(await $manipulatorSkinFile.arrayBuffer()));
            console.log("Updating features from skin", features);

            setEarsFeatures(features);
        } catch (e: any) {
            console.error(e);
        }

        dispatcher("next");
    }
</script>

<div class="flex h-full flex-col items-center gap-10">
    <h1 class="text-3xl">Welcome to <NickAc />'s Ears Manipulator!</h1>
    <div class="flex flex-col justify-center gap-4 text-center">
        <p>Let's get started by selecting a skin or picking a template skin.</p>
        <SkinDropZone on:files={handleFiles} slimArms={manipulatorSkinSlimModel} />
    </div>
</div>
