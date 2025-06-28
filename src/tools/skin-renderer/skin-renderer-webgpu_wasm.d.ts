/* tslint:disable */
/* eslint-disable */
export function setup_scene(settings: SceneCameraSettings, light: SceneLightingSettings, model: SceneCharacterSettings, movement: SceneMovementSettings, skin: Uint8Array): Promise<void>;
export function tick_scene(): void;
export function get_camera(): SceneCameraSettings;
export function get_sun(): SceneLightingSettings;
export function set_camera_rotation(yaw: number, pitch: number, roll: number): void;
export function notify_mouse_down(): Promise<void>;
export function notify_mouse_up(): Promise<void>;
export function notify_mouse_move(x: number, y: number): Promise<void>;
export function notify_mouse_scroll(delta: number): Promise<void>;
export function render_frame(): Promise<void>;
export function initialize(canvas: HTMLCanvasElement, width: number, height: number): Promise<void>;
export class SceneCameraSettings {
  free(): void;
  constructor();
  size: WasmVec2;
  look_at: WasmVec3;
  distance: number;
  rotation: WasmVec3;
}
export class SceneCharacterSettings {
  free(): void;
  constructor();
  is_slim: boolean;
  has_hat_layer: boolean;
  has_ears: boolean;
  has_layers: boolean;
  has_cape: boolean;
}
export class SceneLightingSettings {
  free(): void;
  constructor();
  direction: WasmVec3;
  intensity: number;
  ambient: number;
}
export class SceneMovementSettings {
  free(): void;
  constructor();
  limb_swing: number;
  body_yaw: number;
}
export class WasmVec2 {
  free(): void;
  constructor(x: number, y: number);
  0: number;
  1: number;
}
export class WasmVec3 {
  free(): void;
  constructor(x: number, y: number, z: number);
  0: number;
  1: number;
  2: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly wasmvec2_new: (a: number, b: number) => number;
  readonly __wbg_wasmvec3_free: (a: number, b: number) => void;
  readonly __wbg_get_wasmvec3_2: (a: number) => number;
  readonly __wbg_set_wasmvec3_2: (a: number, b: number) => void;
  readonly wasmvec3_new: (a: number, b: number, c: number) => number;
  readonly __wbg_scenecamerasettings_free: (a: number, b: number) => void;
  readonly __wbg_get_scenecamerasettings_size: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_size: (a: number, b: number) => void;
  readonly __wbg_get_scenecamerasettings_look_at: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_look_at: (a: number, b: number) => void;
  readonly __wbg_get_scenecamerasettings_distance: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_distance: (a: number, b: number) => void;
  readonly __wbg_get_scenecamerasettings_rotation: (a: number) => number;
  readonly __wbg_set_scenecamerasettings_rotation: (a: number, b: number) => void;
  readonly scenecamerasettings_new: () => number;
  readonly __wbg_scenelightingsettings_free: (a: number, b: number) => void;
  readonly __wbg_get_scenelightingsettings_direction: (a: number) => number;
  readonly __wbg_set_scenelightingsettings_direction: (a: number, b: number) => void;
  readonly __wbg_get_scenelightingsettings_intensity: (a: number) => number;
  readonly __wbg_set_scenelightingsettings_intensity: (a: number, b: number) => void;
  readonly __wbg_get_scenelightingsettings_ambient: (a: number) => number;
  readonly __wbg_set_scenelightingsettings_ambient: (a: number, b: number) => void;
  readonly scenelightingsettings_new: () => number;
  readonly __wbg_scenecharactersettings_free: (a: number, b: number) => void;
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
  readonly __wbg_scenemovementsettings_free: (a: number, b: number) => void;
  readonly __wbg_get_scenemovementsettings_limb_swing: (a: number) => number;
  readonly __wbg_set_scenemovementsettings_limb_swing: (a: number, b: number) => void;
  readonly __wbg_get_scenemovementsettings_body_yaw: (a: number) => number;
  readonly __wbg_set_scenemovementsettings_body_yaw: (a: number, b: number) => void;
  readonly scenemovementsettings_new: () => number;
  readonly setup_scene: (a: number, b: number, c: number, d: number, e: number, f: number) => any;
  readonly get_camera: () => number;
  readonly get_sun: () => number;
  readonly notify_mouse_down: () => any;
  readonly notify_mouse_up: () => any;
  readonly notify_mouse_move: (a: number, b: number) => any;
  readonly notify_mouse_scroll: (a: number) => any;
  readonly render_frame: () => any;
  readonly initialize: (a: any, b: number, c: number) => any;
  readonly __wbg_set_wasmvec3_0: (a: number, b: number) => void;
  readonly __wbg_set_wasmvec3_1: (a: number, b: number) => void;
  readonly __wbg_set_wasmvec2_0: (a: number, b: number) => void;
  readonly __wbg_set_wasmvec2_1: (a: number, b: number) => void;
  readonly __wbg_get_wasmvec3_0: (a: number) => number;
  readonly __wbg_get_wasmvec3_1: (a: number) => number;
  readonly __wbg_get_wasmvec2_0: (a: number) => number;
  readonly __wbg_get_wasmvec2_1: (a: number) => number;
  readonly set_camera_rotation: (a: number, b: number, c: number) => void;
  readonly tick_scene: () => void;
  readonly __wbg_wasmvec2_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_6: WebAssembly.Table;
  readonly closure215_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure544_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
