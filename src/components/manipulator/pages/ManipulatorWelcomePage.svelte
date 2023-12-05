<script lang="ts">
    import { manipulatorSkinFile, manipulatorSkinSlimModel } from "$lib/stores";
    import { createEventDispatcher } from "svelte";
    import SkinDropZone from "../../SkinDropZone.svelte";
    import NickAc from "../../homepage/NickAc.svelte";
    
    const dispatcher = createEventDispatcher();

    function handleFiles(e: CustomEvent<FileList>): void {
        const list = e.detail;
        
        if (list.length !== 1) {
            console.error("Only one file can be uploaded at a time.");
            return;
        }
        
        const file = list[0];
        $manipulatorSkinFile = file;
        dispatcher("next");
    }

</script>

<div class="flex flex-col items-center gap-10 h-full">
    <h1 class="text-3xl">Welcome to <NickAc />'s Ears Manipulator!</h1>
    <div class="flex flex-col justify-center gap-4">
        <p>Let's get started by selecting a skin or picking a template skin.</p>
        <SkinDropZone on:files={handleFiles} slimArms={manipulatorSkinSlimModel} />
    </div>
</div>
