<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { browser } from "$app/environment";

    import init, { decode_ears_image, EarsImageWorkspace, encode_ears_image } from "../../../tools/ears-eraser/ears_eraser";

    import Selecto from "svelte-selecto";
    import Moveable, { type OnBeforeResize, type OnDrag, type OnResize } from "svelte-moveable";
    import saveAs from "file-saver";

    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import SkinCanvas from "../../../components/SkinCanvas.svelte";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";
    import { RenderingSupport, renderingSupport } from "$lib/rendering-support";
    import { earsRegionEditorCurrentFile } from "$lib/stores";

    interface EraseRegion {
        x: number;
        y: number;
        width: number;
        height: number;
        free?: () => void;
    }

    onMount(() => {
        let resizeObserver = new ResizeObserver(() => {
            $regions = $regions;
        });

        resizeObserver.observe(imgCanvas);

        return () => {
            resizeObserver.disconnect();
        };
    });

    let moveable: Moveable;
    let selectedRegionIndex: Writable<number | null> = writable(null);

    let imgCanvas: HTMLImageElement;
    let imgContainer: HTMLDivElement;
    let skinDropZone: SkinDropZone;

    let demoUsesSlimSkin = writable(false);

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }

        await init();

        if (!$earsRegionEditorCurrentFile) {
            await skinDropZone.selectDemoSkin();
        } else {
            await handleFile($earsRegionEditorCurrentFile);
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
        e.target.style.transform = "translate(" + left + "px, " + top + "px)";

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
        console.log("updateSkinFile");
        if (!$workspace || !$lastSkin) return;

        const existingRegions: EraseRegion[] = $workspace.get_regions();

        document.querySelectorAll(".region.overlapping").forEach((element) => {
            element.classList.remove("overlapping");
        });

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
            return (imgCanvas?.getBoundingClientRect().top ?? 0) + window.scrollY;
        },
        get left(): number {
            return imgCanvas?.getBoundingClientRect().left ?? 0 + window.scrollX;
        },
        get right(): number {
            return imgCanvas?.getBoundingClientRect().right ?? 0 + window.scrollX;
        },
        get bottom(): number {
            return this.top + imgCanvas.clientHeight;
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

    function updateRegion(target: HTMLElement | SVGElement, block: (r: EraseRegion, index: number) => void) {
        const targetIndex = parseInt(target.getAttribute("data-region-id") ?? "0");
        const region = $regions.find((_, i) => i == targetIndex);
        if (!region) return;

        block(region, targetIndex);

        sanitizeRegion(region);
    }

    function sanitizeRegion(region: EraseRegion): EraseRegion {
        // Make sure we don't have negative values for x and y
        region.x = Math.max(0, region.x);
        region.y = Math.max(0, region.y);

        // Oh, and don't forget to make sure the values are valid u8 values
        region.x = Math.min(region.x, /* u8 max */ 255);
        region.y = Math.min(region.y, /* u8 max */ 255);

        // Next, make sure the size is at least 1
        region.width = Math.max(1, region.width);
        region.height = Math.max(1, region.height);

        // Regions can be at most 32x32
        region.width = Math.min(32, region.width);
        region.height = Math.min(32, region.height);

        // Regions can't be outside of the image
        if (region.x + region.width > 64) {
            region.width = 64 - region.x;
        }
        if (region.y + region.height > 64) {
            region.height = 64 - region.y;
        }

        return region;
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

    let lastResize = Date.now();

    $: imgWidthStyle = lastResize && imgContainer?.clientHeight > imgContainer?.clientWidth ? "100%" : "auto";
    $: imgHeightStyle = imgWidthStyle == "auto" ? "100%" : "auto";
</script>

<RequiresWasm init={initWasm} />

<div class="container flex gap-5 portrait:flex-col landscape:h-[calc(100dvh-var(--navbar-height))]">
    <div class="flex flex-shrink flex-col gap-5">
        <div>
            <h1 class="text-center text-3xl">{$page.data.title}</h1>
            {#if $page.data.description}
                <h2 class="text-center">{$page.data.description}</h2>
            {/if}
        </div>

        <SkinDropZone bind:this={skinDropZone} slimArms={demoUsesSlimSkin} on:files={handleSkinFiles} />

        <div class="flex flex-col gap-2">
            <div class="flex gap-2">
                <label for="slim-skin">Use slim skin</label>
                <input type="checkbox" id="slim-skin" bind:checked={$demoUsesSlimSkin} />
            </div>
            {#if $renderingSupport == RenderingSupport.SoftwareRendering}
                <div class="min-w-none w-full break-words">
                    <p>Warning: Software rendering enabled for the skin preview.</p>
                    <p>Performance might suffer.</p>
                </div>
            {/if}
        </div>

        <div class="flex flex-1 items-center">
            <div class="max-w-[20em]">
                <p class="w-fit">Instructions:</p>
                <ul class="flex w-fit list-inside list-disc flex-col gap-1 pl-4">
                    <li class="w-fit">Drag and drop a skin file</li>
                    <li class="w-fit">
                        <kbd>Click and Drag</kbd>
                        to add a region
                    </li>
                    <li class="w-fit">
                        <kbd>Click</kbd>
                        to select a region
                    </li>
                    <li class="w-fit">
                        <button on:click={handleDelete}>Delete</button>
                        to delete the selected region
                    </li>
                    <li class="w-fit">
                        <button on:click={saveImage}>Save image</button>
                        or right click on the image and
                        <kbd>Save image as...</kbd>
                        to save the skin
                    </li>
                </ul>
            </div>

            <div class="flex flex-1 flex-col items-center">
                <SkinCanvas
                    currentRenderingSupport={renderingSupport}
                    width={150}
                    height={256}
                    on:loaded={updateSkinFile}
                    class="flex-1 object-contain"
                    skin={$lastSkin}
                    slimArms={$demoUsesSlimSkin}
                />
            </div>
        </div>
    </div>

    <div class="flex-1 portrait:aspect-square portrait:w-full" bind:this={imgContainer}>
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
            style:width={imgWidthStyle}
            style:height={imgHeightStyle}
            class="pixelated render aspect-square"
            on:dragstart|preventDefault={() => false}
            on:load={onImageLoad}
            on:error={onImageError}
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
            const left = imgCanvasBounds.left - offset - window.scrollX;
            const top = imgCanvasBounds.top - offset - window.scrollY;
            const right = imgCanvasBounds.right + offset - window.scrollX;
            const bottom = imgCanvasBounds.bottom + offset - window.scrollY;

            const withinX = e.inputEvent.clientX >= left && e.inputEvent.clientX <= right;
            const withinY = e.inputEvent.clientY >= top && e.inputEvent.clientY <= bottom;

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
        lastResize = Date.now();
    }}
/>
<svelte:document on:keyup={handleKeyPress} />

<style lang="postcss">
    .region {
        --border-color: rgb(var(--accent-500));
        --background-color: theme("colors.secondary.500/20%");

        background-color: var(--background-color);

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
