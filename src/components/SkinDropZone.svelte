<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import DropZone from "./DropZone.svelte";
    import { createEventDispatcher } from "svelte";
    import demoSkin from "$lib/assets/demo-skin.png";

    let dispatch = createEventDispatcher();

    let pickerHovered = writable<boolean>(false);
    let filePicker: HTMLInputElement;
    export let slimArms: Writable<boolean> | undefined = undefined;

    function pickFile() {
        filePicker.click();
    }

    function handleInput() {
        if (filePicker.files && filePicker.files.length > 0) {
            dispatch("files", filePicker.files);
            filePicker.value = "";
        }
    }

    function handlePaste(e: ClipboardEvent) {
        if (e.clipboardData?.files?.length && e.clipboardData?.files?.length > 0) {
            dispatch("files", e.clipboardData.files);
        }
    }

    export async function selectDemoSkin() {
        let skin = await fetch(demoSkin);
        let data = await skin.arrayBuffer();

        let list = new DataTransfer();
        let file = new File([data], "demo-skin.png");
        list.items.add(file);
        
        if (slimArms) {
            $slimArms = true;
        }
        dispatch("files", list.files);
    }
</script>

<svelte:window on:paste={handlePaste} />

<DropZone hovered={pickerHovered} on:files>
    <div
        class="flex h-fit w-full max-w-2xl flex-col justify-around gap-5 rounded-2xl border-2 border-dashed border-accent-500 p-10 {$pickerHovered
            ? 'bg-secondary-200'
            : 'bg-secondary-50'} items-center"
    >
        <p>Drop your skin file here or paste it in this page.</p>
        <hr class="m-0 w-full" />
        <div class="text-center">
            <p class="inline">Or alternatively, </p>
            <p class="inline">you can try a</p>
            <button class="link" on:click={selectDemoSkin}>demo skin</button>
            <p class="inline">or</p>
            <button on:click={pickFile}>Pick a file instead</button>
            <p class="inline">.</p>
        </div>
        <input class="hidden" type="file" name="skin" bind:this={filePicker} on:change={handleInput} />
    </div>
</DropZone>
