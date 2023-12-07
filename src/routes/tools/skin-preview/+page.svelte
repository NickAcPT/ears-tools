<script lang="ts">
    import { writable } from "svelte/store";

    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import { page } from "$app/stores";
    import SkinCanvas from "../../../components/SkinCanvas.svelte";
    import { RenderingSupport, renderingSupport } from "$lib/rendering-support";

    let skinDropZone: SkinDropZone;

    let useSlimSkin = writable(false);
    let showLayers = writable(true);
    let showEars = writable(true);
    let showCape = writable(true);

    async function handleSkinFiles(event: CustomEvent<FileList>) {
        const files = event.detail;

        if (files.length == 0) return;

        handleFile(files[0]);
    }

    let lastSkin = writable<File | undefined>(undefined);

    async function handleFile(file: File) {
        $lastSkin = file;
    }
    
    $: skinDropZone && skinDropZone.selectDemoSkin();
    
</script>

<div class="container flex gap-5 portrait:flex-col landscape:h-[calc(100dvh-var(--navbar-height))]">
    <div class="flex flex-shrink flex-col gap-5">
        <div>
            <h1 class="text-center text-3xl">{$page.data.title}</h1>
            {#if $page.data.description}
                <h2 class="text-center">{$page.data.description}</h2>
            {/if}
        </div>

        <SkinDropZone bind:this={skinDropZone} slimArms={useSlimSkin} on:files={handleSkinFiles} />

        <div class="flex flex-col gap-2">
            <div class="flex gap-2">
                <label for="slim-skin">Use slim skin</label>
                <input type="checkbox" id="slim-skin" bind:checked={$useSlimSkin} />
            </div>
            
            <div class="flex gap-2">
                <label for="show-layers">Show layers</label>
                <input type="checkbox" id="show-layers" bind:checked={$showLayers} />
            </div>
            
            <div class="flex gap-2">
                <label for="show-ears">Show ears</label>
                <input type="checkbox" id="show-ears" bind:checked={$showEars} />
            </div>
            
            <div class="flex gap-2">
                <label for="show-cape">Show cape</label>
                <input type="checkbox" id="show-cape" bind:checked={$showCape} />
            </div>
            
            {#if $renderingSupport == RenderingSupport.SoftwareRendering}
                <div class="min-w-none w-full break-words">
                    <p>Warning: Software rendering enabled for the skin preview.</p>
                    <p>Performance might suffer.</p>
                </div>
            {/if}
        </div>
    </div>

    <div class="flex flex-1 portrait:aspect-square portrait:w-full">
        <SkinCanvas
            currentRenderingSupport={renderingSupport}
            width={452}
            height={771}
            class="flex-1 object-contain h-full"
            style="{$renderingSupport == RenderingSupport.SoftwareRendering ? "image-rendering: pixelated" : ""}"
            skin={$lastSkin}
            slimArms={$useSlimSkin}
            showCape={$showCape}
            renderLayers={$showLayers}
            renderEars={$showEars}
            showDevInfo={false}
        />
    </div>
</div>