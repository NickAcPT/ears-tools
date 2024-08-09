<svelte:options runes={true} />

<script lang="ts">
    import { preventDefault } from "$lib/misc";
    import { type Snippet } from "svelte";
    
    interface DropZoneProps {
        hovered?: boolean;
        children?: Snippet;
        
        onfiles?: (files: FileList) => void;
    }
    
    let { onfiles, children, hovered = false }: DropZoneProps = $props();

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            onfiles?.(event.dataTransfer.files);
        }
    }

    function handlePaste(e: ClipboardEvent) {
        if (e.clipboardData?.files?.length && e.clipboardData?.files?.length > 0) {
            onfiles?.(e.clipboardData.files);
        }
    }
</script>

<svelte:window on:paste={handlePaste} />

<div
    class="contents"
    role="form"
    aria-roledescription="File Upload"
    ondragenter={preventDefault(() => (hovered = true))}
    ondragover={preventDefault(() => (hovered = true))}
    ondragleave={preventDefault(() => (hovered = false))}
    ondrop={preventDefault((e) => {
        hovered = false;
        handleDrop(e);
    })}
>
    {#if children}
        {@render children()}
    {/if}
</div>
