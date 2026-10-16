/* @ts-self-types="./skin-renderer-software_wasm.d.ts" */

export class SceneCameraSettings {
    static __wrap(ptr) {
        const obj = Object.create(SceneCameraSettings.prototype);
        obj.__wbg_ptr = ptr;
        SceneCameraSettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SceneCameraSettingsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scenecamerasettings_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get distance() {
        const ret = wasm.__wbg_get_scenecamerasettings_distance(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {WasmVec3}
     */
    get look_at() {
        const ret = wasm.__wbg_get_scenecamerasettings_look_at(this.__wbg_ptr);
        return WasmVec3.__wrap(ret);
    }
    /**
     * @returns {WasmVec3}
     */
    get rotation() {
        const ret = wasm.__wbg_get_scenecamerasettings_rotation(this.__wbg_ptr);
        return WasmVec3.__wrap(ret);
    }
    /**
     * @returns {WasmVec2}
     */
    get size() {
        const ret = wasm.__wbg_get_scenecamerasettings_size(this.__wbg_ptr);
        return WasmVec2.__wrap(ret);
    }
    constructor() {
        const ret = wasm.scenecamerasettings_new();
        this.__wbg_ptr = ret;
        SceneCameraSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} arg0
     */
    set distance(arg0) {
        wasm.__wbg_set_scenecamerasettings_distance(this.__wbg_ptr, arg0);
    }
    /**
     * @param {WasmVec3} arg0
     */
    set look_at(arg0) {
        _assertClass(arg0, WasmVec3);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_scenecamerasettings_look_at(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {WasmVec3} arg0
     */
    set rotation(arg0) {
        _assertClass(arg0, WasmVec3);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_scenecamerasettings_rotation(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {WasmVec2} arg0
     */
    set size(arg0) {
        _assertClass(arg0, WasmVec2);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_scenecamerasettings_size(this.__wbg_ptr, ptr0);
    }
}
if (Symbol.dispose) SceneCameraSettings.prototype[Symbol.dispose] = SceneCameraSettings.prototype.free;

export class SceneCharacterSettings {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SceneCharacterSettingsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scenecharactersettings_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get has_cape() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_cape(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get has_ears() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_ears(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get has_hat_layer() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_hat_layer(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get has_layers() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_layers(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get is_slim() {
        const ret = wasm.__wbg_get_scenecharactersettings_is_slim(this.__wbg_ptr);
        return ret !== 0;
    }
    constructor() {
        const ret = wasm.scenecharactersettings_new();
        this.__wbg_ptr = ret;
        SceneCharacterSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean} arg0
     */
    set has_cape(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_cape(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set has_ears(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_ears(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set has_hat_layer(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_hat_layer(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set has_layers(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_layers(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set is_slim(arg0) {
        wasm.__wbg_set_scenecharactersettings_is_slim(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) SceneCharacterSettings.prototype[Symbol.dispose] = SceneCharacterSettings.prototype.free;

export class SceneLightingSettings {
    static __wrap(ptr) {
        const obj = Object.create(SceneLightingSettings.prototype);
        obj.__wbg_ptr = ptr;
        SceneLightingSettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SceneLightingSettingsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scenelightingsettings_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get ambient() {
        const ret = wasm.__wbg_get_scenelightingsettings_ambient(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {WasmVec3}
     */
    get direction() {
        const ret = wasm.__wbg_get_scenelightingsettings_direction(this.__wbg_ptr);
        return WasmVec3.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get intensity() {
        const ret = wasm.__wbg_get_scenelightingsettings_intensity(this.__wbg_ptr);
        return ret;
    }
    constructor() {
        const ret = wasm.scenelightingsettings_new();
        this.__wbg_ptr = ret;
        SceneLightingSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} arg0
     */
    set ambient(arg0) {
        wasm.__wbg_set_scenelightingsettings_ambient(this.__wbg_ptr, arg0);
    }
    /**
     * @param {WasmVec3} arg0
     */
    set direction(arg0) {
        _assertClass(arg0, WasmVec3);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_scenelightingsettings_direction(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {number} arg0
     */
    set intensity(arg0) {
        wasm.__wbg_set_scenelightingsettings_intensity(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) SceneLightingSettings.prototype[Symbol.dispose] = SceneLightingSettings.prototype.free;

export class WasmVec2 {
    static __wrap(ptr) {
        const obj = Object.create(WasmVec2.prototype);
        obj.__wbg_ptr = ptr;
        WasmVec2Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmVec2Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmvec2_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get 0() {
        const ret = wasm.__wbg_get_wasmvec2_0(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get 1() {
        const ret = wasm.__wbg_get_wasmvec2_1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set 0(arg0) {
        wasm.__wbg_set_wasmvec2_0(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set 1(arg0) {
        wasm.__wbg_set_wasmvec2_1(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        const ret = wasm.wasmvec2_new(x, y);
        this.__wbg_ptr = ret;
        WasmVec2Finalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) WasmVec2.prototype[Symbol.dispose] = WasmVec2.prototype.free;

export class WasmVec3 {
    static __wrap(ptr) {
        const obj = Object.create(WasmVec3.prototype);
        obj.__wbg_ptr = ptr;
        WasmVec3Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmVec3Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmvec3_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get 0() {
        const ret = wasm.__wbg_get_wasmvec3_0(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get 1() {
        const ret = wasm.__wbg_get_wasmvec3_1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get 2() {
        const ret = wasm.__wbg_get_wasmvec3_2(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set 0(arg0) {
        wasm.__wbg_set_wasmvec3_0(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set 1(arg0) {
        wasm.__wbg_set_wasmvec3_1(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set 2(arg0) {
        wasm.__wbg_set_wasmvec3_2(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x, y, z) {
        const ret = wasm.wasmvec3_new(x, y, z);
        this.__wbg_ptr = ret;
        WasmVec3Finalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) WasmVec3.prototype[Symbol.dispose] = WasmVec3.prototype.free;

/**
 * @returns {SceneCameraSettings}
 */
export function get_camera() {
    const ret = wasm.get_camera();
    return SceneCameraSettings.__wrap(ret);
}

/**
 * @returns {SceneLightingSettings}
 */
export function get_sun() {
    const ret = wasm.get_sun();
    return SceneLightingSettings.__wrap(ret);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @returns {Promise<void>}
 */
export function initialize(canvas, width, height) {
    const ret = wasm.initialize(canvas, width, height);
    return ret;
}

/**
 * @returns {Promise<void>}
 */
export function notify_mouse_down() {
    const ret = wasm.notify_mouse_down();
    return ret;
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {Promise<void>}
 */
export function notify_mouse_move(x, y) {
    const ret = wasm.notify_mouse_move(x, y);
    return ret;
}

/**
 * @param {number} delta
 * @returns {Promise<void>}
 */
export function notify_mouse_scroll(delta) {
    const ret = wasm.notify_mouse_scroll(delta);
    return ret;
}

/**
 * @returns {Promise<void>}
 */
export function notify_mouse_up() {
    const ret = wasm.notify_mouse_up();
    return ret;
}

/**
 * @returns {Promise<void>}
 */
export function render_frame() {
    const ret = wasm.render_frame();
    return ret;
}

/**
 * @param {number} yaw
 * @param {number} pitch
 * @param {number} roll
 */
export function set_camera_rotation(yaw, pitch, roll) {
    wasm.set_camera_rotation(yaw, pitch, roll);
}

/**
 * @param {SceneCameraSettings} settings
 * @param {SceneLightingSettings} light
 * @param {SceneCharacterSettings} model
 * @param {Uint8Array} skin
 * @returns {Promise<void>}
 */
export function setup_scene(settings, light, model, skin) {
    _assertClass(settings, SceneCameraSettings);
    var ptr0 = settings.__destroy_into_raw();
    _assertClass(light, SceneLightingSettings);
    var ptr1 = light.__destroy_into_raw();
    _assertClass(model, SceneCharacterSettings);
    var ptr2 = model.__destroy_into_raw();
    const ptr3 = passArray8ToWasm0(skin, wasm.__wbindgen_malloc);
    const len3 = WASM_VECTOR_LEN;
    const ret = wasm.setup_scene(ptr0, ptr1, ptr2, ptr3, len3);
    return ret;
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_9dc85fe1bc224456: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg___wbindgen_is_function_147961669f068cd4: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_undefined_4410e3c20a99fa97: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_throw_bbadd78c1bac3a77: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_c2301a3c9b78104b: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_call_ec09a4cf93377d3a: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_getContext_db5f8ccb275883ba: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_instanceof_CanvasRenderingContext2d_f9f8e0bbab67ac49: function(arg0) {
            let result;
            try {
                result = arg0 instanceof CanvasRenderingContext2D;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_typed_90c3f6c29ba36d19: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen_502287d0b0feb40a___convert__closures_____invoke___js_sys_35a6a58e54befebd___Function_fn_wasm_bindgen_502287d0b0feb40a___JsValue_____wasm_bindgen_502287d0b0feb40a___sys__Undefined___js_sys_35a6a58e54befebd___Function_fn_wasm_bindgen_502287d0b0feb40a___JsValue_____wasm_bindgen_502287d0b0feb40a___sys__Undefined_______true_(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_new_with_u8_clamped_array_and_sh_f6d8e29fe6ef8a82: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
            return ret;
        }, arguments); },
        __wbg_putImageData_d9e40116f89d85bf: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            arg0.putImageData(arg1, arg2, arg3);
        }, arguments); },
        __wbg_queueMicrotask_4698f900840e3286: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_queueMicrotask_477a5533c7100338: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_resolve_0183de2e8c6b1d54: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_set_height_490773009db619eb: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_width_5e8d872fae03f8b5: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_static_accessor_GLOBAL_60a4124bab7dcc9a: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_95ca6460658b5d13: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_4c95f759a91e9aae: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_44b435597f9e9ee7: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_then_3ea18602c6a5123b: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 58, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_502287d0b0feb40a___convert__closures_____invoke___wasm_bindgen_502287d0b0feb40a___JsValue__core_93da0ef9039ef2f___result__Result_____wasm_bindgen_502287d0b0feb40a___JsError___true_);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./skin-renderer-software_wasm_bg.js": import0,
    };
}

function wasm_bindgen_502287d0b0feb40a___convert__closures_____invoke___wasm_bindgen_502287d0b0feb40a___JsValue__core_93da0ef9039ef2f___result__Result_____wasm_bindgen_502287d0b0feb40a___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_502287d0b0feb40a___convert__closures_____invoke___wasm_bindgen_502287d0b0feb40a___JsValue__core_93da0ef9039ef2f___result__Result_____wasm_bindgen_502287d0b0feb40a___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_502287d0b0feb40a___convert__closures_____invoke___js_sys_35a6a58e54befebd___Function_fn_wasm_bindgen_502287d0b0feb40a___JsValue_____wasm_bindgen_502287d0b0feb40a___sys__Undefined___js_sys_35a6a58e54befebd___Function_fn_wasm_bindgen_502287d0b0feb40a___JsValue_____wasm_bindgen_502287d0b0feb40a___sys__Undefined_______true_(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_502287d0b0feb40a___convert__closures_____invoke___js_sys_35a6a58e54befebd___Function_fn_wasm_bindgen_502287d0b0feb40a___JsValue_____wasm_bindgen_502287d0b0feb40a___sys__Undefined___js_sys_35a6a58e54befebd___Function_fn_wasm_bindgen_502287d0b0feb40a___JsValue_____wasm_bindgen_502287d0b0feb40a___sys__Undefined_______true_(arg0, arg1, arg2, arg3);
}

const SceneCameraSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scenecamerasettings_free(ptr, 1));
const SceneCharacterSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scenecharactersettings_free(ptr, 1));
const SceneLightingSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scenelightingsettings_free(ptr, 1));
const WasmVec2Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmvec2_free(ptr, 1));
const WasmVec3Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmvec3_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function getClampedArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ClampedArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedUint8ClampedArrayMemory0 = null;
function getUint8ClampedArrayMemory0() {
    if (cachedUint8ClampedArrayMemory0 === null || cachedUint8ClampedArrayMemory0.byteLength === 0) {
        cachedUint8ClampedArrayMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    cachedUint8ClampedArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('skin-renderer-software_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
