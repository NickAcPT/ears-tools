/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} skin_bytes
* @param {number} model
* @param {boolean} layers
* @returns {ConversionResult}
*/
export function generate_blockbench_model(skin_bytes: Uint8Array, model: number, layers: boolean): ConversionResult;
/**
*/
export enum WasmPlayerModel {
  Steve = 0,
  Alex = 1,
}
/**
*/
export class ConversionResult {
  free(): void;
/**
* @returns {any}
*/
  value(): any;
/**
* @returns {boolean}
*/
  is_error(): boolean;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_conversionresult_free: (a: number) => void;
  readonly conversionresult_value: (a: number) => number;
  readonly conversionresult_is_error: (a: number) => number;
  readonly generate_blockbench_model: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: (a: number) => void;
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
