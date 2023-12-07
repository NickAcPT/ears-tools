<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import DropZone from "./DropZone.svelte";
    import { createEventDispatcher } from "svelte";
    import demoSkin from "$lib/assets/demo-skin.png";

    let dispatch = createEventDispatcher();

    let pickerHovered = writable<boolean>(false);
    let filePicker: HTMLInputElement;
    export let slimArms: Writable<boolean> | undefined = undefined;
        
    export let offerDemoSkin: boolean = true;

    function pickFile() {
        filePicker.click();
    }

    function handleInput() {
        if (filePicker.files && filePicker.files.length > 0) {
            dispatch("files", filePicker.files);
            filePicker.value = "";
        }
    }

    export async function selectDemoSkin() {
        if (!offerDemoSkin) return;
        
        let skin = await fetch(demoSkin);
        let data = await skin.arrayBuffer();

        let list = new DataTransfer();
        let file = new File([data], "demo-skin.png", { type: "image/png" });
        list.items.add(file);
        
        if (slimArms) {
            $slimArms = true;
        }
        dispatch("files", list.files);
    }
    
    $: pickerBgClass = $pickerHovered ? 'bg-secondary-200' : 'bg-secondary-50';
</script>

<DropZone hovered={pickerHovered} on:files>
    <div
        class="flex h-fit w-full max-w-2xl flex-col justify-around gap-5 rounded-2xl border-2 border-dashed border-accent-500 p-10 {pickerBgClass} items-center"
    >
        <p>Drop your <slot name="file">skin</slot> file here or paste it in this page.</p>
        <hr class="m-0 w-full" />
        <div class="text-center">
            <p class="inline">Or alternatively, </p>
            {#if offerDemoSkin}
                <p class="inline">you can try a</p>
                <button class="link" on:click={selectDemoSkin}>demo skin</button>
                <p class="inline">or</p>
            {/if}
            <button on:click={pickFile}>Pick a file instead</button>
            <p class="inline">.</p>
        </div>
        <input class="hidden" type="file" name="file" bind:this={filePicker} on:change={handleInput} />
    </div>
</DropZone>
