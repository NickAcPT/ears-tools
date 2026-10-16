import { RenderingSupport } from "./rendering-support";
import type * as SkinRendererWasm from "../tools/skin-renderer/skin-renderer-webgpu_wasm";

export type SkinRendererModule = typeof SkinRendererWasm;

export interface SkinCanvasCameraSettings {
    rotation: [number, number, number];
    distance: number;
    look_at: [number, number, number];
}

export interface SkinCanvasSunSettings {
    direction: [number, number, number];
    renderShading: boolean;
    intensity?: number;
    ambient?: number;
}

export interface SkinCanvasCharacterSettings {
    renderEars: boolean;
    renderLayers: boolean;
    slimArms: boolean;
    showCape: boolean;
}

const rendererModules = import.meta.glob("../tools/skin-renderer/*.js");
// The wasm-bindgen glue keeps its renderer state at module level, so a second canvas needs its own module instance.
const isolatedRendererModules = import.meta.glob("../tools/skin-renderer/*.js", { query: "?isolated" });

const rendererModuleNames: Record<RenderingSupport, string> = {
    [RenderingSupport.WebGPU]: "skin-renderer-webgpu_wasm",
    [RenderingSupport.WebGL]: "skin-renderer-webgl_wasm",
    [RenderingSupport.SoftwareRendering]: "skin-renderer-software_wasm",
};

/**
 * Imports the renderer glue for the given rendering support. `isolated` returns a module instance that does not
 * share renderer state with the one used by the interactive skin canvas.
 */
export async function importSkinRendererModule(support: RenderingSupport, isolated = false): Promise<SkinRendererModule> {
    const modules = isolated ? isolatedRendererModules : rendererModules;
    return <SkinRendererModule>await modules[`../tools/skin-renderer/${rendererModuleNames[support]}.js`]();
}

export async function checkWebGpuSupport(): Promise<boolean> {
    // @ts-expect-error gpu is available in browser when using webgpu
    if (!navigator.gpu) {
        return false;
    }

    // Try to get a canvas context
    try {
        const canvas = document.createElement("canvas");
        if (!canvas.getContext("webgpu")) {
            throw new Error("WebGPU is supported, but no context could be created");
        }
    } catch (error) {
        return false;
    }

    // Try to request an adapter and device
    try {
        // @ts-expect-error gpu is available in browser when using webgpu
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error("WebGPU is supported, but no adapter could be requested");
        }
        const device = await adapter.requestDevice();
        if (!device) {
            throw new Error("WebGPU is supported, but no device could be requested");
        }
    } catch (error) {
        return false;
    }

    return true;
}

/**
 * Builds the scene from the given settings and loads it into the renderer module.
 */
export async function setupSkinScene(
    module: SkinRendererModule,
    size: [number, number],
    camera: SkinCanvasCameraSettings,
    sun: SkinCanvasSunSettings,
    character: SkinCanvasCharacterSettings,
    skin: Uint8Array
) {
    const { SceneCameraSettings, SceneLightingSettings, SceneCharacterSettings, WasmVec2, WasmVec3, setup_scene } = module;

    const cameraSettings = new SceneCameraSettings();
    cameraSettings.size = new WasmVec2(size[0], size[1]);
    cameraSettings.distance = camera.distance;
    cameraSettings.rotation = new WasmVec3(camera.rotation[0], camera.rotation[1], camera.rotation[2]);
    cameraSettings.look_at = new WasmVec3(camera.look_at[0], camera.look_at[1], camera.look_at[2]);

    const lighting = new SceneLightingSettings();
    lighting.direction = new WasmVec3(sun.direction[0], sun.direction[1], sun.direction[2]);
    lighting.ambient = sun.ambient != undefined ? sun.ambient : sun.renderShading ? 0.621 : 1.0;
    lighting.intensity = sun.intensity != undefined ? sun.intensity : 2.0;

    const characterSettings = new SceneCharacterSettings();
    characterSettings.has_ears = character.renderEars;
    characterSettings.has_hat_layer = character.renderLayers;
    characterSettings.has_layers = character.renderLayers;
    characterSettings.is_slim = character.slimArms;
    characterSettings.has_cape = character.showCape;

    await setup_scene(cameraSettings, lighting, characterSettings, skin);
}
