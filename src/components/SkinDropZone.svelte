<script lang="ts">
    import { writable } from "svelte/store";
    import DropZone from "./DropZone.svelte";
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
            filePicker.value = "";
        }
    }
</script>

<DropZone hovered={pickerHovered} on:files>
    <div
        class="flex h-fit w-full max-w-2xl flex-col justify-around gap-5 rounded-2xl border-2 border-dashed border-accent-500 p-10 {$pickerHovered
            ? 'bg-secondary-200'
            : 'bg-secondary-50'} items-center"
    >
        <p>Drop your skin file here or paste it in this page.</p>
        <hr class="m-0 w-full" />
        <div class="flex items-baseline">
            <p class="inline">Or alternatively,</p>
            <button on:click={pickFile}>Pick a file instead</button>
            <p class="inline">.</p>
        </div>
        <input class="hidden" type="file" name="skin" bind:this={filePicker} on:change={handleInput} />
    </div>
</DropZone>
