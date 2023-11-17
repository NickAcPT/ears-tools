<script lang="ts">
    import { browser } from "$app/environment";
    import type { SkinCanvasCameraSettings, SkinCanvasSunSettings } from "$lib/types";
    import { writable, type Writable } from "svelte/store";
    import RequiresJs from "./RequiresJs.svelte";

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
         look_at: [0, 16.5, 0]
     }
     
     export let sun: SkinCanvasSunSettings = {
         direction: [0.0, 1.0, 1.0],
         renderShading: true,
         intensity: 2.0
     }
    
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
        let run_event_loop = module?.run_event_loop;

        if (init && initialize) {
            await init();

            await initialize(canvas, width, height);
            isInitialized = true;

            setTimeout(function () {
                if (run_event_loop) {
                    run_event_loop(canvas, canvasSize());
                }
            }, 1);
        }
    }

    function vec2(x: number, y: number) {
        if (module == null) throw new Error("Module is null");
        return new module.WasmVec2(x, y);
    }

    function vec3(x: number, y: number, z: number) {
        if (module == null) throw new Error("Module is null");
        return new module.WasmVec3(x, y, z);
    }
    
    async function setupScene(skinFile: File, camera: SkinCanvasCameraSettings, sun: SkinCanvasSunSettings, renderEars: boolean, renderLayers: boolean, slimArms: boolean, showCape: boolean = false) {
        console.log(skinFile, camera, sun, renderEars, renderLayers, slimArms);
        
        if (!browser || !skinFile || !isInitialized) return Promise.resolve();
        if (module == null) throw new Error("Module is null");
        
        let {SceneCameraSettings, SceneLightingSettings, SceneCharacterSettings, setup_scene, get_camera, get_sun} = module;
        
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
    
    $: isInitialized && skin && setupScene(skin, camera, sun, renderEars, renderLayers, slimArms);
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

<canvas bind:this={canvas}></canvas>
