<script lang="ts">
    import { writable } from "svelte/store";
    import { browser } from "$app/environment";

    import type { EarsImageWorkspace, WasmEraseRegion } from "../../../tools/ears-eraser/ears-eraser_wasm";
    import init, { decode_ears_image, encode_ears_image, get_regions, set_regions } from "../../../tools/ears-eraser/ears-eraser_wasm";

    import Selecto from "svelte-selecto";
    import Moveable, { type OnBeforeResize, type OnDrag, type OnResize } from "svelte-moveable";
    import saveAs from "file-saver";

    import RequiresJs from "../../../components/RequiresJs.svelte";
    import SkinDropZone from "../../../components/SkinDropZone.svelte";

    interface EraseRegion {
        x: number;
        y: number;
        width: number;
        height: number;
        free?: () => void;
    }

    let moveable: Moveable;
    let targets: (HTMLElement | SVGElement)[] = [];

    let imgCanvas: HTMLImageElement;

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }

        await init();
    }

    async function handleSkinFiles(event: CustomEvent<FileList>) {
        const files = event.detail;

        if (files.length == 0) return;

        handleFile(files[0]);
    }

    function handleDragEvent(e: OnDrag) {
        const left = roundToPixelWidth(e.translate[0]);
        const top = roundToPixelHeight(e.translate[1]);
        e.target.style.transform = "translate(" + left + "px, " + roundToPixelHeight(top) + "px)";

        e.target.setAttribute("data-x", (left / getImagePixelWidth()).toString());
        e.target.setAttribute("data-y", (top / getImagePixelHeight()).toString());
    }

    function handleBeforeResizeEvent(e: OnBeforeResize) {
        let width = roundToPixelWidth(e.boundingWidth) / getImagePixelHeight();
        let height = roundToPixelHeight(e.boundingHeight) / getImagePixelHeight();

        width = Math.max(1, width);
        height = Math.max(1, height);
        
        width = Math.min(32, width);
        height = Math.min(32, height);
        
        e.setSize([width * getImagePixelWidth(), height * getImagePixelHeight()]);

        e.target.setAttribute("data-width", width.toString());
        e.target.setAttribute("data-height", height.toString());
    }

    function handleResizeEvent(e: OnResize) {
        e.target.style.width = `${e.boundingWidth}px`;
        e.target.style.height = `${e.boundingHeight}px`;

        if (e.drag) {
            handleDragEvent(e.drag);
        }

        e.target.style.transform = e.transform;
    }

    let workspace = writable<EarsImageWorkspace | undefined>(undefined); // @hmr:keep
    let regions = writable<EraseRegion[]>([]); // @hmr:keep
    let lastSkin = writable<File | undefined>(undefined); // @hmr:keep

    async function handleFile(file: File) {
        $workspace?.free();
        $lastSkin = file;
    }

    function removeRegion(index: number) {
        $regions = $regions.filter((_, i) => i != index);
    }

    $: imageSource =
        ($lastSkin && URL.createObjectURL($lastSkin)) ?? "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=";

    async function onImageLoad() {
        if (!imgCanvas || !$lastSkin) return;

        $workspace = decode_ears_image(new Uint8Array(await $lastSkin.arrayBuffer()));
        $regions = get_regions($workspace);
    }

    async function updateSkinFile() {
        if (!$workspace || !$lastSkin) return;

        const existingRegions: EraseRegion[] = get_regions($workspace);

        const changed =
            existingRegions.length != $regions.length ||
            existingRegions
                .map((region, i) => {
                    const newRegion = $regions[i];

                    const differentX = region.x != newRegion.x;
                    const differentY = region.y != newRegion.y;
                    const differentWidth = region.width != newRegion.width;
                    const differentHeight = region.height != newRegion.height;

                    region.free?.();

                    return differentX || differentY || differentWidth || differentHeight;
                })
                .includes(true);

        if (!changed) return;

        console.log("Changed skin file");

        set_regions($workspace, $regions);

        const newImage = encode_ears_image(new Uint8Array(await $lastSkin.arrayBuffer()), $workspace);

        $lastSkin = new File([newImage], $lastSkin.name, { type: $lastSkin.type });
    }

    let imgCanvasBounds = {
        get top(): number {
            return imgCanvas?.getBoundingClientRect().top ?? 0;
        },
        get left(): number {
            return imgCanvas?.getBoundingClientRect().left ?? 0;
        },
        get right(): number {
            return imgCanvas?.getBoundingClientRect().right ?? 0;
        },
        get bottom(): number {
            return imgCanvas?.getBoundingClientRect().bottom ?? 0;
        },
    };

    function getImagePixelWidth(): number {
        return imgCanvas.clientWidth / imgCanvas.naturalWidth;
    }

    function getImagePixelHeight(): number {
        return imgCanvas.clientHeight / imgCanvas.naturalHeight;
    }

    function roundToPixelWidth(value: number): number {
        return Math.round(value / getImagePixelWidth()) * getImagePixelWidth();
    }

    function roundToPixelHeight(value: number): number {
        return Math.round(value / getImagePixelHeight()) * getImagePixelHeight();
    }

    function notifyRegionUpdate(element: HTMLElement | SVGElement) {
        let regionIdData = element.getAttribute("data-region-id");
        if (!regionIdData) return;

        let regionId = parseInt(regionIdData);
        let x = parseInt(element.getAttribute("data-x") ?? "0");
        let y = parseInt(element.getAttribute("data-y") ?? "0");
        let width = parseInt(element.getAttribute("data-width") ?? "1");
        let height = parseInt(element.getAttribute("data-height") ?? "1");

        $regions[regionId] = { x, y, width, height };

        updateSkinFile();
    }

    function addRegion(x: number, y: number, w: number, h: number) {
        if (!$workspace) return;

        $regions = [...$regions, { x, y, width: w, height: h }];

        updateSkinFile();
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key == "Delete") {
            console.log(targets);
            targets.toReversed().forEach((target) => {
                let regionIdData = target.getAttribute("data-region-id");
                console.log(regionIdData);
                if (!regionIdData) return;

                let regionId = parseInt(regionIdData);
                let region = $regions[regionId];

                region?.free?.();

                removeRegion(regionId);
            });
            
            //targets = [];

            updateSkinFile();
        }
    }


    function saveImage() {
        if (!imgCanvas) return;
        
        const src = imgCanvas.src;
        saveAs(src, "skin.png");
    }
</script>

<RequiresJs>
    {#await initWasm()}
        <p class="text-center">Loading...</p>
    {:catch error}
        <div class="relative left-0 my-5 flex w-full flex-col items-center gap-2 border-y-2 border-gray-400 bg-red-500/10 p-2">
            <p class="p-2 text-center text-xl">It seems like your browser doesn't support WebAssembly</p>
            <p>Please check if you have a recent version of your browser, and if you do, please contact @nickac on Discord.</p>
            <p>Error: {error.message}</p>
        </div>
    {/await}
</RequiresJs>

<div class="container grid grid-rows-[auto_auto] gap-2 md:grid-cols-[auto_auto]">
    <div class="flex flex-col">
        <SkinDropZone on:files={handleSkinFiles} />

        <!--
            Instructions:
            - Drag and drop a skin file
            - `Double click` to add a region
            - `Click` to select a region
            - `Shift + Click` to add a region to the selection
            - `Delete` to delete the selected regions
            - <Save image> or right click on the image and `Save image as...` to save the skin
          -->
        <div>
            <p>Instructions:</p>
            <ul class="list-disc list-inside flex flex-col gap-1 pl-4">
                <li>Drag and drop a skin file</li>
                <li>
                    <kbd>Double click</kbd> to add a region
                </li>
                <li>
                    <kbd>Click</kbd> to select a region
                </li>
                <li>
                    <kbd>Shift + Click</kbd> to add a region to the selection
                </li>
                <li>
                    <kbd>Delete</kbd> to delete the selected regions
                </li>
                <li>
                    <button on:click={saveImage}>Save image</button> or right click on the image and <kbd>Save image as...</kbd> to save the skin
                </li>
        </div>
    </div>
    <div>
        {#if imgCanvas}
            {#each $regions as region, i (i)}
                <div
                    class="region absolute block"
                    style:transform="translate({region.x * getImagePixelWidth()}px, {region.y * getImagePixelHeight()}px)"
                    style:width="{getImagePixelWidth() * region.width}px"
                    style:height="{getImagePixelHeight() * region.height}px"
                    data-region-id={i}
                    data-x={region.x}
                    data-y={region.y}
                    data-width={region.width}
                    data-height={region.height}
                ></div>
            {/each}
        {/if}

        <img
            on:dragstart|preventDefault={() => false}
            on:load={onImageLoad}
            class="pixelated render aspect-square flex-1"
            width="100%"
            src={imageSource}
            bind:this={imgCanvas}
            alt="Minecraft Skin"
        />
    </div>
</div>

{#if browser}
    <Moveable
        bind:this={moveable}
        bounds={imgCanvasBounds}
        on:drag={({ detail: e }) => handleDragEvent(e)}
        on:beforeResize={({ detail: e }) => handleBeforeResizeEvent(e)}
        on:resize={({ detail: e }) => handleResizeEvent(e)}
        on:dragEnd={({ detail: e }) => notifyRegionUpdate(e.target)}
        on:resizeEnd={({ detail: e }) => notifyRegionUpdate(e.target)}
        snappable
        draggable
        resizable
        useResizeObserver
        useMutationObserver
        origin={false}
        target={targets}
    />

    <Selecto
        selectableTargets={[".region"]}
        hitRate={40}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={"shift"}
        on:selectEnd={({ detail: e }) => {
            if (e.isDragStart) {
                e.inputEvent.preventDefault();
                moveable.waitToChangeTarget().then(() => {
                    moveable.dragStart(e.inputEvent);
                });
            }
            targets = e.selected;

            if (targets.length == 0 && e.isDouble) {
                let eventX = e.inputEvent.clientX - imgCanvasBounds.left;
                let eventY = e.inputEvent.clientY - imgCanvasBounds.top;
                let x = Math.round(eventX / getImagePixelWidth()) - 2;
                let y = Math.round(eventY / getImagePixelHeight()) - 2;

                addRegion(Math.max(0, x), Math.max(0, y), 4, 4);
            }
        }}
    />
{/if}

<svelte:window
    on:resize={() => {
        $regions = $regions;
    }}
/>
<svelte:document on:keyup={handleKeyPress} />

<style lang="postcss">
    .region {
        @apply bg-secondary-500/20;

        --border-color: rgb(var(--accent-500));

        background-image: linear-gradient(90deg, var(--border-color) 50%, transparent 50%),
            linear-gradient(90deg, var(--border-color) 50%, transparent 50%),
            linear-gradient(0deg, var(--border-color) 50%, transparent 50%), linear-gradient(0deg, var(--border-color) 50%, transparent 50%);
        background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;

        background-size:
            15px 2px,
            15px 2px,
            2px 15px,
            2px 15px;
        background-position:
            left top,
            right bottom,
            left bottom,
            right top;
        animation: border-dance 1s infinite linear;
    }

    @keyframes border-dance {
        0% {
            background-position:
                left top,
                right bottom,
                left bottom,
                right top;
        }
        100% {
            background-position:
                left 15px top,
                right 15px bottom,
                left bottom 15px,
                right top 15px;
        }
    }
    
    kbd {
        @apply bg-secondary-500/20 p-1 rounded;
    }
</style>
