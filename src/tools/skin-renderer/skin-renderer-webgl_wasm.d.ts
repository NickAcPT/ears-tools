/* tslint:disable */
/* eslint-disable */
/**
* @param {SceneCameraSettings} settings
* @param {SceneLightingSettings} light
* @param {SceneCharacterSettings} model
* @param {Uint8Array} skin
* @returns {Promise<void>}
*/
export function setup_scene(settings: SceneCameraSettings, light: SceneLightingSettings, model: SceneCharacterSettings, skin: Uint8Array): Promise<void>;
/**
* @returns {SceneCameraSettings}
*/
export function get_camera(): SceneCameraSettings;
/**
* @returns {SceneLightingSettings}
*/
export function get_sun(): SceneLightingSettings;
/**
* @param {number} yaw
* @param {number} pitch
* @param {number} roll
*/
export function set_camera_rotation(yaw: number, pitch: number, roll: number): void;
/**
* @param {HTMLCanvasElement} canvas
* @param {WasmVec2} size
* @returns {Promise<void>}
*/
export function run_event_loop(canvas: HTMLCanvasElement, size: WasmVec2): Promise<void>;
/**
* @param {HTMLCanvasElement} canvas
* @param {number} width
* @param {number} height
* @returns {Promise<void>}
*/
export function initialize(canvas: HTMLCanvasElement, width: number, height: number): Promise<void>;
/**
*/
export class SceneCameraSettings {
  free(): void;
/**
*/
  constructor();
/**
*/
  distance: number;
/**
*/
  look_at: WasmVec3;
/**
*/
  rotation: WasmVec3;
/**
*/
  size: WasmVec2;
}
/**
*/
export class SceneCharacterSettings {
  free(): void;
/**
*/
  constructor();
/**
*/
  has_cape: boolean;
/**
*/
  has_ears: boolean;
/**
*/
  has_hat_layer: boolean;
/**
*/
  has_layers: boolean;
/**
*/
  is_slim: boolean;
}
/**
*/
export class SceneLightingSettings {
  free(): void;
/**
*/
  constructor();
/**
*/
  ambient: number;
/**
*/
  direction: WasmVec3;
/**
*/
  intensity: number;
}
/**
*/
export class WasmVec2 {
  free(): void;
/**
* @param {number} x
* @param {number} y
*/
  constructor(x: number, y: number);
/**
*/
  0: number;
/**
*/
  1: number;
}
/**
*/
export class WasmVec3 {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @param {number} z
*/
  constructor(x: number, y: number, z: number);
/**
*/
  0: number;
/**
*/
  1: number;
/**
*/
  2: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmvec2_free: (a: number) => void;
  readonly __wbg_get_wasmvec2_0: (a: number) => number;
  readonly __wbg_set_wasmvec2_0: (a: number, b: number) => void;
  readonly __wbg_get_wasmvec2_1: (a: number) => number;
  readonly __wbg_set_wasmvec2_1: (a: number, b: number) => void;
  readonly wasmvec2_new: (a: number, b: number) => number;
  readonly __wbg_wasmvec3_free: (a: number) => void;
  readonly __wbg_get_wasmvec3_2: (a: number) => number;
  readonly __wbg_set_wasmvec3_2: (a: number, b: number) => void;
  readonly wasmvec3_new: (a: number, b: number, c: number) => number;
  readonly __wbg_scenecamerasettings_free: (a: number) => void;
  readonly __wbg_get_scenecamerasettings_size: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_size: (a: number, b: number) => void;
  readonly __wbg_get_scenecamerasettings_look_at: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_look_at: (a: number, b: number) => void;
  readonly __wbg_get_scenecamerasettings_distance: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_distance: (a: number, b: number) => void;
  readonly __wbg_get_scenecamerasettings_rotation: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_rotation: (a: number, b: number) => void;
  readonly scenecamerasettings_new: () => number;
  readonly __wbg_scenelightingsettings_free: (a: number) => void;
  readonly __wbg_get_scenelightingsettings_direction: (a: number) => number;
  readonly __wbg_set_scenelightingsettings_direction: (a: number, b: number) => void;
  readonly __wbg_get_scenelightingsettings_intensity: (a: number) => number;
  readonly __wbg_set_scenelightingsettings_intensity: (a: number, b: number) => void;
  readonly __wbg_get_scenelightingsettings_ambient: (a: number) => number;
  readonly __wbg_set_scenelightingsettings_ambient: (a: number, b: number) => void;
  readonly scenelightingsettings_new: () => number;
  readonly __wbg_scenecharactersettings_free: (a: number) => void;
  readonly __wbg_get_scenecharactersettings_is_slim: (a: number) => number;
  readonly __wbg_set_scenecharactersettings_is_slim: (a: number, b: number) => void;
  readonly __wbg_get_scenecharactersettings_has_hat_layer: (a: number) => number;
  readonly __wbg_set_scenecharactersettings_has_hat_layer: (a: number, b: number) => void;
  readonly __wbg_get_scenecharactersettings_has_ears: (a: number) => number;
  readonly __wbg_set_scenecharactersettings_has_ears: (a: number, b: number) => void;
  readonly __wbg_get_scenecharactersettings_has_layers: (a: number) => number;
  readonly __wbg_set_scenecharactersettings_has_layers: (a: number, b: number) => void;
  readonly __wbg_get_scenecharactersettings_has_cape: (a: number) => number;
  readonly __wbg_set_scenecharactersettings_has_cape: (a: number, b: number) => void;
  readonly scenecharactersettings_new: () => number;
  readonly setup_scene: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly get_camera: () => number;
  readonly get_sun: () => number;
  readonly run_event_loop: (a: number, b: number) => number;
  readonly initialize: (a: number, b: number, c: number) => number;
  readonly __wbg_set_wasmvec3_0: (a: number, b: number) => void;
  readonly __wbg_set_wasmvec3_1: (a: number, b: number) => void;
  readonly set_camera_rotation: (a: number, b: number, c: number) => void;
  readonly __wbg_get_wasmvec3_0: (a: number) => number;
  readonly __wbg_get_wasmvec3_1: (a: number) => number;
  readonly wgpu_compute_pass_set_pipeline: (a: number, b: number) => void;
  readonly wgpu_compute_pass_set_bind_group: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_compute_pass_set_push_constant: (a: number, b: number, c: number, d: number) => void;
  readonly wgpu_compute_pass_insert_debug_marker: (a: number, b: number, c: number) => void;
  readonly wgpu_compute_pass_push_debug_group: (a: number, b: number, c: number) => void;
  readonly wgpu_compute_pass_pop_debug_group: (a: number) => void;
  readonly wgpu_compute_pass_write_timestamp: (a: number, b: number, c: number) => void;
  readonly wgpu_compute_pass_begin_pipeline_statistics_query: (a: number, b: number, c: number) => void;
  readonly wgpu_compute_pass_end_pipeline_statistics_query: (a: number) => void;
  readonly wgpu_compute_pass_dispatch_workgroups: (a: number, b: number, c: number, d: number) => void;
  readonly wgpu_compute_pass_dispatch_workgroups_indirect: (a: number, b: number, c: number) => void;
  readonly wgpu_render_bundle_set_pipeline: (a: number, b: number) => void;
  readonly wgpu_render_bundle_set_bind_group: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_bundle_set_vertex_buffer: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_bundle_set_push_constants: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_bundle_draw: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_bundle_draw_indexed: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly wgpu_render_bundle_draw_indirect: (a: number, b: number, c: number) => void;
  readonly wgpu_render_bundle_draw_indexed_indirect: (a: number, b: number, c: number) => void;
  readonly wgpu_render_pass_set_pipeline: (a: number, b: number) => void;
  readonly wgpu_render_pass_set_bind_group: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_pass_set_vertex_buffer: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_pass_set_push_constants: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_pass_draw: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_pass_draw_indexed: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly wgpu_render_pass_draw_indirect: (a: number, b: number, c: number) => void;
  readonly wgpu_render_pass_draw_indexed_indirect: (a: number, b: number, c: number) => void;
  readonly wgpu_render_pass_multi_draw_indirect: (a: number, b: number, c: number, d: number) => void;
  readonly wgpu_render_pass_multi_draw_indexed_indirect: (a: number, b: number, c: number, d: number) => void;
  readonly wgpu_render_pass_multi_draw_indirect_count: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly wgpu_render_pass_multi_draw_indexed_indirect_count: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly wgpu_render_pass_set_blend_constant: (a: number, b: number) => void;
  readonly wgpu_render_pass_set_scissor_rect: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_pass_set_viewport: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly wgpu_render_pass_set_stencil_reference: (a: number, b: number) => void;
  readonly wgpu_render_pass_insert_debug_marker: (a: number, b: number, c: number) => void;
  readonly wgpu_render_pass_push_debug_group: (a: number, b: number, c: number) => void;
  readonly wgpu_render_pass_pop_debug_group: (a: number) => void;
  readonly wgpu_render_pass_write_timestamp: (a: number, b: number, c: number) => void;
  readonly wgpu_render_pass_begin_occlusion_query: (a: number, b: number) => void;
  readonly wgpu_render_pass_end_occlusion_query: (a: number) => void;
  readonly wgpu_render_pass_begin_pipeline_statistics_query: (a: number, b: number, c: number) => void;
  readonly wgpu_render_pass_end_pipeline_statistics_query: (a: number) => void;
  readonly wgpu_render_pass_execute_bundles: (a: number, b: number, c: number) => void;
  readonly wgpu_render_bundle_set_index_buffer: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_bundle_pop_debug_group: (a: number) => void;
  readonly wgpu_render_bundle_insert_debug_marker: (a: number, b: number) => void;
  readonly wgpu_render_pass_set_index_buffer: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpu_render_bundle_push_debug_group: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly wasm_bindgen__convert__closures__invoke1_mut__h042feed1ef6b947b: (a: number, b: number, c: number) => void;
  readonly wasm_bindgen__convert__closures__invoke0_mut__hf32a38aa99206169: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures__invoke1_mut__h1d744d890e1b408e: (a: number, b: number, c: number) => void;
  readonly wasm_bindgen__convert__closures__invoke1_mut__h5381c57265804c70: (a: number, b: number, c: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h93dddc09c5782875: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
