/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} skin_bytes
* @returns {WasmEarsEraseWorkspace}
*/
export function decode_ears_image(skin_bytes: Uint8Array): WasmEarsEraseWorkspace;
/**
* NOTE: `workspace` is consumed here.
* @param {Uint8Array} skin_bytes
* @param {WasmEarsEraseWorkspace} workspace
* @returns {Uint8Array}
*/
export function encode_ears_image(skin_bytes: Uint8Array, workspace: WasmEarsEraseWorkspace): Uint8Array;
/**
*/
export class WasmEarsEraseWorkspace {
  free(): void;
/**
* @returns {any}
*/
  get_regions(): any;
/**
* @param {any} regions
*/
  set_regions(regions: any): void;
}
/**
*/
export class WasmEraseRegion {
  free(): void;
/**
*/
  height: number;
/**
*/
  width: number;
/**
*/
  x: number;
/**
*/
  y: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmeraseregion_free: (a: number) => void;
  readonly __wbg_get_wasmeraseregion_x: (a: number) => number;
  readonly __wbg_set_wasmeraseregion_x: (a: number, b: number) => void;
  readonly __wbg_get_wasmeraseregion_y: (a: number) => number;
  readonly __wbg_set_wasmeraseregion_y: (a: number, b: number) => void;
  readonly __wbg_get_wasmeraseregion_width: (a: number) => number;
  readonly __wbg_set_wasmeraseregion_width: (a: number, b: number) => void;
  readonly __wbg_get_wasmeraseregion_height: (a: number) => number;
  readonly __wbg_set_wasmeraseregion_height: (a: number, b: number) => void;
  readonly __wbg_wasmearseraseworkspace_free: (a: number) => void;
  readonly wasmearseraseworkspace_get_regions: (a: number, b: number) => void;
  readonly wasmearseraseworkspace_set_regions: (a: number, b: number, c: number) => void;
  readonly decode_ears_image: (a: number, b: number, c: number) => void;
  readonly encode_ears_image: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
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
