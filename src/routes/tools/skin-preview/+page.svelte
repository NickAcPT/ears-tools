<script lang="ts">
    import { writable } from "svelte/store";

    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import { page } from "$app/stores";
    import SkinCanvas from "../../../components/SkinCanvas.svelte";
    import { RenderingSupport, renderingSupport } from "$lib/rendering-support";
    import { browser } from "$app/environment";
    import type { SkinCanvasSunSettings } from "$lib/skin-canvas";
    import initManipulator, { get_ears_features } from "../../../tools/ears-manipulator/ears_manipulator";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";
    import type { EarsFeatures } from "$lib/ears-manipulator";

    let skinDropZone: SkinDropZone;

    let useSlimSkin = writable(false);
    let showLayers = writable(true);
    let showEars = writable(true);
    let showCape = writable(true);
    let lightsOut = writable(false);

    let isSkinEmissive = writable(false);
    let isManipulatorWasmLoaded = writable(false);

    async function handleSkinFiles(event: CustomEvent<FileList>) {
        const files = event.detail;

        if (files.length == 0) return;

        handleFile(files[0]);
    }

    let lastSkin = writable<File | undefined>(undefined);

    $: sun = {
        direction: [0.0, 1.0, 1.0],
        renderShading: true,
        intensity: $isSkinEmissive && $lightsOut ? 0.0 : null,
        ambient: $isSkinEmissive && $lightsOut ? 0.0 : null,
    } as SkinCanvasSunSettings;

    async function handleFile(file: File) {
        $lastSkin = file;
        
        if ($isManipulatorWasmLoaded) {
            try {
                const features: EarsFeatures | undefined = await get_ears_features(new Uint8Array(await file.arrayBuffer()));
                $isSkinEmissive = features?.emissives?.enabled || false;
            } catch (e) {
                console.warn("Failed to get skin features", e);
            }
        }
    }

    async function initManipulatorWasm() {
        if (!browser) {
            return Promise.resolve();
        }
        
        try {
            await initManipulator();
            $isManipulatorWasmLoaded = true;
        } catch (e) {
            console.warn("Failed to initialize ears manipulator", e);
        }
    }

    $: skinDropZone && skinDropZone.selectDemoSkin();
</script>

<RequiresWasm init={initManipulatorWasm}/>

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

            {#if $isSkinEmissive}
                <div class="flex gap-2">
                    <label for="lights-out">
                        Lights out! <em>(To test emissive skins)</em>
                    </label>
                    <input type="checkbox" id="lights-out" bind:checked={$lightsOut} />
                </div>
            {/if}

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
            class="h-full flex-1 object-contain"
            style={$renderingSupport == RenderingSupport.SoftwareRendering ? "image-rendering: pixelated" : ""}
            skin={$lastSkin}
            slimArms={$useSlimSkin}
            showCape={$showCape}
            renderLayers={$showLayers}
            renderEars={$showEars}
            showDevInfo={false}
            bind:sun
        />
    </div>
</div>
