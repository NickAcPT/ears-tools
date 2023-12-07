<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { writable } from "svelte/store";

    const dispatch = createEventDispatcher();

    export let hovered = writable(false);

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            dispatch("files", event.dataTransfer.files);
        }
    }

    function handlePaste(e: ClipboardEvent) {
        if (e.clipboardData?.files?.length && e.clipboardData?.files?.length > 0) {
            dispatch("files", e.clipboardData.files);
        }
    }
</script>

<svelte:window on:paste={handlePaste} />

<div
    class="contents"
    role="form"
    aria-roledescription="File Upload"
    on:dragenter|preventDefault={() => hovered.set(true)}
    on:dragover|preventDefault={() => hovered.set(true)}
    on:dragleave|preventDefault={() => hovered.set(false)}
    on:drop|preventDefault={() => hovered.set(false)}
    on:drop={handleDrop}
>
    <slot />
</div>
