<script lang="ts">
    import { browser } from "$app/environment";
    import type { SkinCanvasCameraSettings, SkinCanvasSunSettings } from "$lib/types";
    import RequiresWasm from "./RequiresWasm.svelte";

    type SkinRendererModule = typeof import("../tools/skin-renderer/skin-renderer_wasm.js");

    export let width = 512;
    export let height = 832;

    export let slimArms = false;
    export let renderLayers = true;
    export let renderEars = true;
    export let attemptToUseWebGpu = true;

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

    function hasWebGpu(): boolean {
        let hasWebGpu = false;
        try {
            let tempCanvas = document.createElement("canvas");

            hasWebGpu = tempCanvas.getContext("webgpu") != null && attemptToUseWebGpu != false;
        } catch (e) {
            // No-op
        }

        return hasWebGpu;
    }

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }

        let name = hasWebGpu() ? "skin-renderer_wasm" : "skin-renderer-webgl_wasm";
        module = await import(`../tools/skin-renderer/${name}.js`);

        let init = module?.default;
        let initialize = module?.initialize;

        if (init && initialize) {
            await init();

            await initialize(canvas, width, height);
            isInitialized = true;

            window.requestAnimationFrame(renderSkin);
        }
    }

    async function renderSkin() {
        if (module == null) throw new Error("Module is null");

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
        showCape: boolean = false
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
        await handlePointerDown();
    }

    async function handleTouchEnd(e: TouchEvent) {
        await handlePointerUp();
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

    $: isInitialized && skin && setupScene(skin, camera, sun, renderEars, renderLayers, slimArms);
</script>

<RequiresWasm init={initWasm} />

<canvas
    style:display={isInitialized ? "block" : "none"}
    bind:this={canvas}
    {...$$restProps}
    on:touchstart|preventDefault={handleTouchStart}
    on:touchend|preventDefault={handleTouchEnd}
    on:touchmove|preventDefault={handleTouchMove}
    on:pointerdown={handlePointerDown}
    on:pointerup={handlePointerUp}
    on:pointermove={handlePointerMove}
    on:wheel={handleScroll}
></canvas>

<style lang="postcss">
    canvas {
        width: auto;
    }
</style>
