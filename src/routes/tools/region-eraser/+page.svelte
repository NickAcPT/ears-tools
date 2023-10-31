<script lang="ts">
    import { writable } from "svelte/store";
    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import type { EarsImageWorkspace } from "../../../tools/ears-eraser/ears-eraser_wasm";
    import init, { decode_ears_image, get_regions } from "../../../tools/ears-eraser/ears-eraser_wasm";

    import { browser } from "$app/environment";
    import Moveable from "svelte-moveable";
    import Selecto from "svelte-selecto";
    import RequiresJs from "../../../components/RequiresJs.svelte";

    interface EraseRegion {
        x: number;
        y: number;
        width: number;
        height: number;
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

    $: $regions && console.log($regions);

    $: imageSource =
        ($lastSkin && URL.createObjectURL($lastSkin)) ?? "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=";

    async function onImageLoad() {
        if (!imgCanvas || !$lastSkin) return;

        $workspace = decode_ears_image(new Uint8Array(await $lastSkin.arrayBuffer()));
        $regions = get_regions($workspace);
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
    }

    let extraProps = {};
</script>

<RequiresJs>
    {#await initWasm()}
        <p class="text-center">Loading...</p>
    {:catch error}
        <div class="relative left-0 my-5 flex w-full flex-col items-center gap-2 border-y-2 border-gray-400 bg-red-500/10 p-2">
            <p class="p-2 text-center text-xl">It seems like your browser doesn't support WebAssembly</p>
            <p>Please check if you have a recent version of your browser, and if you do, please contact @nickacpt on Discord.</p>
            <p>Error: {error.message}</p>
        </div>
    {/await}
</RequiresJs>

<div class="container grid grid-cols-[auto_auto]">
    <div class="flex flex-col">
        <SkinDropZone on:files={handleSkinFiles} />
        <div class="flex flex-1 flex-col gap-2">
            {#each $regions as region, i (i)}
                <div class="flex items-center gap-2">
                    <p class="text-center">Region {i + 1}</p>
                    <p class="text-center">X: {region.x}</p>
                    <p class="text-center">Y: {region.y}</p>
                    <p class="text-center">Width: {region.width}</p>
                    <p class="text-center">Height: {region.height}</p>
                    <button on:click={() => removeRegion(i)}>Remove</button>
                </div>
            {/each}
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
        origin={false}
        on:drag={({ detail: e }) => {
            const left = roundToPixelWidth(e.translate[0]);
            const top = roundToPixelHeight(e.translate[1]);
            e.target.style.transform = "translate(" + left + "px, " + roundToPixelHeight(top) + "px)";

            e.target.setAttribute("data-x", (left / getImagePixelWidth()).toString());
            e.target.setAttribute("data-y", (top / getImagePixelHeight()).toString());
        }}
        bounds={imgCanvasBounds}
        useResizeObserver={true}
        useMutationObserver={true}
        on:beforeResize={({ detail: e }) => {
            const width = roundToPixelWidth(e.boundingWidth);
            const height = roundToPixelHeight(e.boundingHeight);

            e.setSize([width, height]);

            e.target.setAttribute("data-width", (width / getImagePixelWidth()).toString());
            e.target.setAttribute("data-height", (height / getImagePixelHeight()).toString());
        }}
        on:resize={({ detail: e }) => {
            e.target.style.width = `${e.boundingWidth}px`;
            e.target.style.height = `${e.boundingHeight}px`;

            if (e.drag) {
                const left = roundToPixelWidth(e.drag.translate[0]);
                const top = roundToPixelHeight(e.drag.translate[1]);
                
                e.target.setAttribute("data-x", (left / getImagePixelWidth()).toString());
                e.target.setAttribute("data-y", (top / getImagePixelHeight()).toString());
            }

            console.log(e);
            e.target.style.transform = e.transform;
        }}
        on:dragEnd={({ detail: e }) => {
            notifyRegionUpdate(e.target);
        }}
        on:resizeEnd={({ detail: e }) => {
            notifyRegionUpdate(e.target);
        }}
        props={extraProps}
        snappable
        draggable
        resizable
        target={targets}
    />

    <Selecto
        selectableTargets={[".region"]}
        dragContainer={document.body}
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
        }}
    />
{/if}

<style lang="postcss">
    .region {
        @apply border-2 border-dashed border-gray-500/50 bg-gray-500/30;
    }
</style>
