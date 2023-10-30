<script lang="ts">
    import { writable } from "svelte/store";
    import DropZone from "../DropZone.svelte";
    import { createEventDispatcher } from "svelte";
    
    let dispatch = createEventDispatcher();

    let pickerHovered = writable<boolean>(false);
    let filePicker: HTMLInputElement;

    function pickFile() {
        filePicker.click();
    }
    
    function handleInput() {
        if (filePicker.files && filePicker.files.length > 0) {
            dispatch("files", filePicker.files);
        }
    }
</script>

<DropZone hovered={pickerHovered} on:files>
    <div
        class="w-full flex flex-col max-w-2xl rounded-2xl p-10 justify-around gap-5 border-2 border-accent-500 border-dashed {$pickerHovered
            ? 'bg-secondary-200'
            : 'bg-secondary-50'} items-center"
    >
        <p>Drop your skin file here or paste it in this page.</p>
        <hr class="w-full m-0" />
        <div class="flex items-baseline">
            <p class="inline">Or alternatively,</p>
            <button on:click={pickFile}>Pick a file instead</button>
            <p class="inline">.</p>
        </div>
        <input class="hidden" type="file" name="skin" bind:this={filePicker} on:change={handleInput} />
    </div>
</DropZone>
