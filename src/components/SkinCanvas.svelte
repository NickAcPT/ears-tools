<script lang="ts">
    import { browser, dev } from "$app/environment";
    import { RenderingSupport, fallbackToNext as fallbackRenderingSupport } from "$lib/rendering-support";
    import type { SkinCanvasCameraSettings, SkinCanvasSunSettings } from "$lib/skin-canvas";
    import type { Readable } from "svelte/store";
    import RequiresWasm from "./RequiresWasm.svelte";
    import { page } from "$app/stores";

    type SkinRendererModule = typeof import("../tools/skin-renderer/skin-renderer-webgpu_wasm");

    export let width = 512;
    export let height = 832;

    export let showDevInfo = true;
    export let showCape = true;
    export let slimArms = false;
    export let renderLayers = true;
    export let renderEars = true;
    export let currentRenderingSupport: Readable<RenderingSupport>;

    export let camera: SkinCanvasCameraSettings = {
        rotation: [20, 10, 0],
        distance: 45,
        look_at: [0, 16.5, 0],
    };

    export let sun: SkinCanvasSunSettings = {
        direction: [0.0, 1.0, 1.0],
        renderShading: true,
        intensity: 2.0,
    };

    export let skin: File | null = null;

    let isLoadedAlready = false;
    let isInitialized = false;

    let canvas: HTMLCanvasElement;

    let module: SkinRendererModule | null = null;

    function checkWebGpuSupport(): boolean {
        if (!browser || $currentRenderingSupport !== RenderingSupport.WebGPU) {
            return true;
        }

        // @ts-expect-error gpu is available in browser when using webgpu
        if (!navigator.gpu) {
            return false;
        }

        // @ts-expect-error gpu is available in browser when using webgpu
        if (browser && navigator.gpu) {
            // Try to get a canvas context
            try {
                const canvas = document.createElement("canvas");
                if (!canvas.getContext("webgpu")) {
                    throw new Error("WebGPU is supported, but no context could be created");
                }
                return true;
            } catch (error) {
                return false;
            }
        }

        return true;
    }

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }
        isLoadedAlready = false;
        isInitialized = false;
        
        const renderingOverride = $page.url.searchParams.get("rendering");
        if (renderingOverride) {
            let targetSupport: RenderingSupport | undefined = undefined;
            try {
                targetSupport = RenderingSupport[renderingOverride as keyof typeof RenderingSupport];
            } catch (e) {
                console.error("Invalid rendering override provided", e);
            }
            
            if (targetSupport != undefined && targetSupport != $currentRenderingSupport) {
                console.log("Overriding rendering support to", RenderingSupport[targetSupport]);
                $currentRenderingSupport = targetSupport;
                throw new Error("Rendering support overridden");
            }
        }
        
        
        try {
            let renderers = import.meta.glob("./../tools/skin-renderer/*.js");
            let name = "";
            switch ($currentRenderingSupport) {
                case RenderingSupport.WebGPU:
                    name = "skin-renderer-webgpu_wasm";
                    break;
                case RenderingSupport.WebGL:
                    name = "skin-renderer-webgl_wasm";
                    break;
                case RenderingSupport.SoftwareRendering:
                    name = "skin-renderer-software_wasm";
                    break;
            }

            if (renderingOverride == undefined && !checkWebGpuSupport()) {
                throw new Error("WebGPU is not supported - Performing fallback");
            }

            module = <SkinRendererModule>await renderers[`../tools/skin-renderer/${name}.js`]();

            let init = module?.default;
            let initialize = module?.initialize;

            if (init && initialize) {
                const handleError = (e: any) => {
                    console.log("An error occurred while initializing the skin renderer module, falling back", e);
                    fallbackRenderingSupport();
                };
                await init().catch(handleError);
                
                console.log("Initialized skin renderer module", width, height)
                
                if (width % 4 != 0) {
                    // Width must be a multiple of 4
                    throw new Error("Width must be a multiple of 4");
                }

                await initialize(canvas, width, height).catch(handleError);
                canvas.width = width;
                canvas.height = height;
                isInitialized = true;

                window.requestAnimationFrame(renderSkin);
            }
        } catch (e) {
            console.log("An error occurred while setting up the skin renderer module, falling back", e);
            fallbackRenderingSupport();
        }
    }

    async function renderSkin() {
        if (module == null || !isInitialized) return;

        let { render_frame } = module;

        await render_frame();

        window.requestAnimationFrame(renderSkin);
    }

    function vec2(x: number, y: number) {
        if (module == null) throw new Error("Module is null");
        return new module.WasmVec2(x, y);
    }

    function vec3(x: number, y: number, z: number) {
        if (module == null) throw new Error("Module is null");
        return new module.WasmVec3(x, y, z);
    }

    async function setupScene(
        skinFile: File,
        camera: SkinCanvasCameraSettings,
        sun: SkinCanvasSunSettings,
        renderEars: boolean,
        renderLayers: boolean,
        slimArms: boolean,
        showCape: boolean
    ) {
        console.log(skinFile, camera, sun, renderEars, renderLayers, slimArms);

        if (!browser || !skinFile || !isInitialized) return Promise.resolve();
        if (module == null) throw new Error("Module is null");

        let { SceneCameraSettings, SceneLightingSettings, SceneCharacterSettings, setup_scene, get_camera, get_sun } = module;

        if (isLoadedAlready) {
            let cameraSettings = get_camera();
            let sunSettings = get_sun();

            camera.distance = cameraSettings.distance;
            camera.rotation = [cameraSettings.rotation[0], cameraSettings.rotation[1], cameraSettings.rotation[2]];

            sun.direction = [sunSettings.direction[0], sunSettings.direction[1], sunSettings.direction[2]];
            sun.intensity = sunSettings.intensity;

            sunSettings.free();
            cameraSettings.free();
        }

        let settings = new SceneCameraSettings();
        settings.size = canvasSize();
        settings.distance = camera.distance;
        settings.rotation = vec3(camera.rotation[0], camera.rotation[1], camera.rotation[2]);
        settings.look_at = vec3(camera.look_at[0], camera.look_at[1], camera.look_at[2]);

        let lighting = new SceneLightingSettings();
        lighting.direction = vec3(sun.direction[0], sun.direction[1], sun.direction[2]);
        lighting.ambient = sun.renderShading ? 0.621 : 1.0;
        lighting.intensity = sun.intensity;

        let character = new SceneCharacterSettings();
        character.has_ears = renderEars;
        character.has_hat_layer = renderLayers;
        character.has_layers = renderLayers;
        character.is_slim = slimArms;
        character.has_cape = showCape;

        await setup_scene(settings, lighting, character, new Uint8Array(await skinFile.arrayBuffer()));
        console.log("Setup scene");
        isLoadedAlready = true;
    }

    function canvasSize() {
        return vec2(width, height);
    }

    async function handlePointerDown(e: PointerEvent) {
        canvas.setPointerCapture(e.pointerId);
        if (module == null || !isInitialized) return;
        await module.notify_mouse_down();
    }

    async function handlePointerUp(e: PointerEvent) {
        canvas.releasePointerCapture(e.pointerId);
        if (module == null || !isInitialized) return;
        await module.notify_mouse_up();
    }

    async function handlePointerMove(e: PointerEvent) {
        if (module == null || !isInitialized) return;
        await module.notify_mouse_move(e.clientX, e.clientY);
    }

    async function handleScroll(e: WheelEvent) {
        if (module == null || !isInitialized) return;
        await module.notify_mouse_scroll(-e.deltaY / 20);
    }

    async function handleTouchStart(e: TouchEvent) {
        await handlePointerDown(new PointerEvent("pointerdown", e));
    }

    async function handleTouchEnd(e: TouchEvent) {
        await handlePointerUp(new PointerEvent("pointerup", e));
    }

    let lastDist: number | undefined = undefined;
    async function handleTouchMove(e: TouchEvent) {
        if (module == null) throw new Error("Module is null");

        // Convert zoom to scroll
        if (e.touches.length > 1) {
            let touch1 = e.touches[0];
            let touch2 = e.touches[1];

            let dist = Math.sqrt(Math.pow(touch1.clientX - touch2.clientX, 2) + Math.pow(touch1.clientY - touch2.clientY, 2));

            if (lastDist) {
                await module.notify_mouse_scroll(-(lastDist - dist) / 20);
            }

            lastDist = dist;
        } else if (e.touches.length == 1) {
            let touch = e.touches[0];
            await module.notify_mouse_move(touch.clientX / 4, touch.clientY / 4);
        }
    }

    $: canvas && isInitialized && skin && setupScene(skin, camera, sun, renderEars, renderLayers, slimArms, showCape);
</script>

{#if dev && showDevInfo}
    <button on:click={() => fallbackRenderingSupport()}>Fallback Rendering Support</button>
    <p>Current: {RenderingSupport[$currentRenderingSupport]}</p>
{/if}

{#key $currentRenderingSupport}
    <RequiresWasm updateReceiver={currentRenderingSupport} init={initWasm} />

    <div class="flex min-h-0 max-h-full">
        <canvas
        style:width="100%"
        style:display={isInitialized ? "block" : "none"}
        bind:this={canvas}
        {...$$restProps}
        on:touchstart|preventDefault={handleTouchStart}
        on:touchend|preventDefault={handleTouchEnd}
        on:touchmove|preventDefault={handleTouchMove}
        on:pointerdown|preventDefault={handlePointerDown}
        on:pointerup|preventDefault={handlePointerUp}
        on:pointermove|preventDefault={handlePointerMove}
        on:wheel|preventDefault={handleScroll}
    ></canvas>
    </div>
{/key}

<style lang="postcss">
    canvas {
        width: auto;
    }
</style>
