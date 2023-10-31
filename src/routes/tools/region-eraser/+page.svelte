<script lang="ts">
    import { writable } from "svelte/store";
    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import type { EarsImageWorkspace, WasmEraseRegion } from "../../../tools/ears-eraser/ears-eraser_wasm";
    import init, { get_regions, set_regions, decode_ears_image } from "../../../tools/ears-eraser/ears-eraser_wasm";

    import { browser } from "$app/environment";
    import RequiresJs from "../../../components/RequiresJs.svelte";
    import Moveable from "svelte-moveable";
    import Selecto from "svelte-selecto";
    import { onMount } from "svelte";

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
    let regions = writable<WasmEraseRegion[]>([]); // @hmr:keep
    let lastSkin = writable<File | undefined>(undefined); // @hmr:keep

    async function handleFile(file: File) {
        $workspace?.free();

        $lastSkin = file;

        $workspace = decode_ears_image(new Uint8Array(await $lastSkin.arrayBuffer()));
        $regions = get_regions($workspace);
    }

    function removeRegion(index: number) {
        $regions = $regions.filter((_, i) => i != index);
    }

    $: $regions && console.log($regions);

    $: imageSource =
        ($lastSkin && URL.createObjectURL($lastSkin)) ?? "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=";
        
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
        return (imgCanvas.clientHeight / imgCanvas.naturalHeight);
    }
    
    function roundToPixelWidth(value: number): number {
        return Math.round(value / getImagePixelWidth()) * getImagePixelWidth();
    }
    
    function roundToPixelHeight(value: number): number {
        return Math.round(value / getImagePixelHeight()) * getImagePixelHeight();
    }
    
    let extraProps = {
        /* get horizontalGuidelines(): number[] {
            const step = getImagePixelHeight();
            const result = [];
            for (let i = 0; i <= imgCanvas.clientHeight; i += step) {
                result.push(i);
            }
            
            console.log(result);
            return result;
        },
        
        get verticalGuidelines(): number[] {
            const step = getImagePixelWidth();
            const result = [];
            for (let i = 0; i <= imgCanvas.clientWidth; i += step) {
                result.push(i);
            }
            
            return result;
        },
        
        get snapThreshold(): number {
            return Math.max(getImagePixelWidth(), getImagePixelHeight());
        }, */
    };
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
                <!-- 
                Display the regions with tailwind:
                Each region has an x, y, width and height (show these)
                Allow to remove the region (call removeRegion(i))
                -->
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
        {#each $regions as region, i (i)}
            <div class="region absolute"
            style:width="{getImagePixelWidth() * region.width}px"
            style:height="{getImagePixelHeight() * region.height}px"
            >Region {i}</div>
        {/each}

        <img
            on:dragstart|preventDefault={() => false}
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
            const left = e.translate[0];
            const top = e.translate[1];
            e.target.style.transform = 'translate(' + roundToPixelWidth(left) + 'px, ' + roundToPixelHeight(top) + 'px)';
        }}
        bounds={imgCanvasBounds}
        useResizeObserver={true}
        useMutationObserver={true}
        on:beforeResize={({ detail: e }) => {
            e.setSize([
                roundToPixelWidth(e.boundingWidth),
                roundToPixelHeight(e.boundingHeight),
            ]);
        }}
        on:resize={({ detail: e }) => {
            e.target.style.width = `${(e.boundingWidth)}px`;
            e.target.style.height = `${(e.boundingHeight)}px`;
            e.target.style.transform = e.transform;
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
