<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { browser, dev } from "$app/environment";

    import init, { decode_ears_image, EarsImageWorkspace, encode_ears_image } from "../../../tools/ears-eraser/ears_eraser";

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
    let selectedRegionIndex: Writable<number | null> = writable(null);

    let imgCanvas: HTMLImageElement;
    let skinDropZone: SkinDropZone;

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }

        await init();

        if (dev) {
            await skinDropZone.selectDemoSkin();
        }
    }

    async function handleSkinFiles(event: CustomEvent<FileList>) {
        const files = event.detail;

        if (files.length == 0) return;

        handleFile(files[0]);
    }

    function handleDragEvent(e: OnDrag) {
        if (!isFinite(getImagePixelWidth()) || !isFinite(getImagePixelHeight())) return;

        const left = roundToPixelWidth(e.translate[0]);
        const top = roundToPixelHeight(e.translate[1]);
        e.target.style.transform = "translate(" + left + "px, " + roundToPixelHeight(top) + "px)";

        updateRegion(e.target, (r) => {
            r.x = left / getImagePixelWidth();
            r.y = top / getImagePixelHeight();
        });
    }

    function handleBeforeResizeEvent(e: OnBeforeResize) {
        let width = roundToPixelWidth(e.boundingWidth) / getImagePixelHeight();
        let height = roundToPixelHeight(e.boundingHeight) / getImagePixelHeight();

        width = Math.max(1, width);
        height = Math.max(1, height);

        width = Math.min(32, width);
        height = Math.min(32, height);

        e.setSize([width * getImagePixelWidth(), height * getImagePixelHeight()]);

        updateRegion(e.target, (r) => {
            r.width = width;
            r.height = height;
        });
    }

    function handleResizeEvent(e: OnResize) {
        e.target.style.width = `${e.boundingWidth}px`;
        e.target.style.height = `${e.boundingHeight}px`;

        if (e.drag) {
            handleDragEvent(e.drag);
        }

        e.target.style.transform = e.transform;
    }

    let workspace = writable<EarsImageWorkspace | undefined>(undefined);
    let regions = writable<EraseRegion[]>([]);
    let lastSkin = writable<File | undefined>(undefined);

    async function handleFile(file: File) {
        $workspace?.free();
        $workspace = undefined;
        $lastSkin = file;
    }

    function removeRegion(index: number) {
        $regions = $regions.filter((_, i) => i != index);

        if ($selectedRegionIndex == index) {
            $selectedRegionIndex = null;
        }
    }

    $: imageSource =
        ($lastSkin && URL.createObjectURL($lastSkin)) ?? "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=";

    async function onImageLoad() {
        if (!imgCanvas || !$lastSkin) return;

        try {
            $workspace?.free();
            $workspace = undefined;
        } catch (error) {
            console.error("Failed to free previous workspace", error);
        }

        try {
            $workspace = decode_ears_image(new Uint8Array(await $lastSkin.arrayBuffer()));
            $regions = $workspace.get_regions();
        } catch (error) {
            alert("Failed to load skin file.\nAre you sure that's a valid Minecraft skin?\n(I'm looking for a PNG file)");
            $lastSkin = undefined;
            $workspace?.free();
            $workspace = undefined;
            $regions = [];
            console.error(error);
        }
    }

    async function onImageError() {
        alert("Failed to load skin file.\nAre you sure that's a valid Minecraft skin?\n(I'm looking for a PNG file)");
        $lastSkin = undefined;
        $workspace = undefined;
        $regions = [];
    }

    async function updateSkinFile() {
        if (!$workspace || !$lastSkin) return;

        const existingRegions: EraseRegion[] = $workspace.get_regions();

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

        $workspace.set_regions($regions);
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

    function updateRegion(target: HTMLElement | SVGElement, block: (r: EraseRegion) => void) {
        const targetIndex = parseInt(target.getAttribute("data-region-id") ?? "0");
        const region = $regions.find((_, i) => i == targetIndex);
        if (!region) return;

        block(region);

        sanitizeRegion(region);
    }

    function sanitizeRegion(region: EraseRegion): EraseRegion {
        let x = region.x;
        let y = region.y;
        let width = region.width;
        let height = region.height;

        // Make sure we don't have negative values for x and y
        x = Math.max(0, x);
        y = Math.max(0, y);

        // Oh, and don't forget to make sure the values are valid u8 values
        x = Math.min(x, /* u8 max */ 255);
        y = Math.min(y, /* u8 max */ 255);

        // Next, make sure the size is at least 1
        width = Math.max(1, width);
        height = Math.max(1, height);

        // Regions can be at most 32x32
        width = Math.min(32, width);
        height = Math.min(32, height);

        // If we have a region that comes from Rust, just free it and allocate a new one in JS
        region.free?.();

        return { x, y, width, height };
    }

    async function addRegion(x: number, y: number, w: number, h: number, index: number | null = null) {
        if (!$workspace) return;

        let newRegion = sanitizeRegion({ x, y, width: w, height: h });

        if (index == null) {
            $regions = [...$regions, newRegion];
            $selectedRegionIndex = $regions.length - 1;
        } else {
            $regions[index] = newRegion;
        }

        await updateSkinFile();
    }

    async function handleKeyPress(event: KeyboardEvent) {
        if (event.key == "Delete") {
            await handleDelete();
        }
    }

    async function handleDelete() {
        let index = $selectedRegionIndex;
        if (index == null) return;

        let region = $regions[index];
        region?.free?.();

        removeRegion(index);

        $selectedRegionIndex = null;

        await updateSkinFile();
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
        <SkinDropZone bind:this={skinDropZone} on:files={handleSkinFiles} />
        <!--
            Instructions:
            - Drag and drop a skin file
            - `Double click` to add a region
            - `Click` to select a region
            - `Shift + Click` to add a region to the selection
            - <Delete> to delete the selected regions
            - <Save image> or right click on the image and `Save image as...` to save the skin
          -->
        <div>
            <p>Instructions:</p>
            <ul class="flex list-inside list-disc flex-col gap-1 pl-4">
                <li>Drag and drop a skin file</li>
                <li>
                    <kbd>Click and Drag</kbd>
                    to add a region
                </li>
                <li>
                    <kbd>Click</kbd>
                    to select a region
                </li>
                <li>
                    <button on:click={handleDelete}>Delete</button>
                    to delete the selected region
                </li>
                <li>
                    <button on:click={saveImage}>Save image</button>
                    or right click on the image and
                    <kbd>Save image as...</kbd>
                    to save the skin
                </li>
            </ul>
        </div>
    </div>
    <div>
        {#if imgCanvas}
            {#each $regions as region, i (i)}
                <div
                    class="region absolute block"
                    class:selected={$selectedRegionIndex == i}
                    style:transform="translate({region.x * getImagePixelWidth()}px, {region.y * getImagePixelHeight()}px)"
                    style:width="{getImagePixelWidth() * region.width}px"
                    style:height="{getImagePixelHeight() * region.height}px"
                    data-region-id={i}
                ></div>
            {/each}
        {/if}

        <img
            on:dragstart|preventDefault={() => false}
            on:load={onImageLoad}
            on:error={onImageError}
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
        on:dragEnd={updateSkinFile}
        on:resizeEnd={updateSkinFile}
        snappable
        draggable
        resizable
        useResizeObserver
        useMutationObserver
        origin={false}
        target={$selectedRegionIndex != null ? `.region[data-region-id="${$selectedRegionIndex}"]` : ""}
    />

    <Selecto
        hitRate={40}
        selectByClick
        selectFromInside={false}
        selectableTargets={[".region"]}
        boundContainer={imgCanvas}
        dragCondition={(e) => {
            const offset = 10;

            const withinX = e.inputEvent.clientX >= imgCanvasBounds.left - offset && e.inputEvent.clientX <= imgCanvasBounds.right + offset;
            const withinY = e.inputEvent.clientY >= imgCanvasBounds.top - offset && e.inputEvent.clientY <= imgCanvasBounds.bottom + offset;

            return withinX && withinY;
        }}
        on:dragEnd={async ({ detail: e }) => {
            if (!e.isSelect) return;

            let eventX = e.rect.left - imgCanvasBounds.left;
            let eventY = e.rect.top - imgCanvasBounds.top;
            let x = Math.round(eventX / getImagePixelWidth());
            let y = Math.round(eventY / getImagePixelHeight());

            let width = Math.round(e.rect.width / getImagePixelWidth());
            let height = Math.round(e.rect.height / getImagePixelHeight());

            if (width < 1 || height < 1) {
                return;
            }

            await addRegion(Math.max(0, x), Math.max(0, y), Math.max(1, width), Math.max(1, height));
        }}
        on:selectEnd={({ detail: e }) => {
            if (e.isDragStart) {
                e.inputEvent.preventDefault();
                moveable.waitToChangeTarget().then(() => {
                    moveable.dragStart(e.inputEvent);
                });
            }

            if (e.selected.length == 0) {
                $selectedRegionIndex = null;
            } else {
                let regionId = e.selected[0]?.getAttribute("data-region-id");
                $selectedRegionIndex = regionId ? parseInt(regionId) : null;
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
        @apply rounded bg-secondary-500/20 p-1;
    }
</style>
