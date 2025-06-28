let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedUint8ClampedArrayMemory0 = null;

function getUint8ClampedArrayMemory0() {
    if (cachedUint8ClampedArrayMemory0 === null || cachedUint8ClampedArrayMemory0.byteLength === 0) {
        cachedUint8ClampedArrayMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedArrayMemory0;
}

function getClampedArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ClampedArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

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
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
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
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {SceneCameraSettings} settings
 * @param {SceneLightingSettings} light
 * @param {SceneCharacterSettings} model
 * @param {SceneMovementSettings} movement
 * @param {Uint8Array} skin
 * @returns {Promise<void>}
 */
export function setup_scene(settings, light, model, movement, skin) {
    _assertClass(settings, SceneCameraSettings);
    var ptr0 = settings.__destroy_into_raw();
    _assertClass(light, SceneLightingSettings);
    var ptr1 = light.__destroy_into_raw();
    _assertClass(model, SceneCharacterSettings);
    var ptr2 = model.__destroy_into_raw();
    _assertClass(movement, SceneMovementSettings);
    var ptr3 = movement.__destroy_into_raw();
    const ptr4 = passArray8ToWasm0(skin, wasm.__wbindgen_malloc);
    const len4 = WASM_VECTOR_LEN;
    const ret = wasm.setup_scene(ptr0, ptr1, ptr2, ptr3, ptr4, len4);
    return ret;
}

export function tick_scene() {
    wasm.tick_scene();
}

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
 * @param {number} yaw
 * @param {number} pitch
 * @param {number} roll
 */
export function set_camera_rotation(yaw, pitch, roll) {
    wasm.set_camera_rotation(yaw, pitch, roll);
}

/**
 * @returns {Promise<void>}
 */
export function notify_mouse_down() {
    const ret = wasm.notify_mouse_down();
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
export function render_frame() {
    const ret = wasm.render_frame();
    return ret;
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

function __wbg_adapter_18(arg0, arg1, arg2) {
    wasm.closure51_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_102(arg0, arg1, arg2, arg3) {
    wasm.closure68_externref_shim(arg0, arg1, arg2, arg3);
}

const SceneCameraSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scenecamerasettings_free(ptr >>> 0, 1));

export class SceneCameraSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
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
     * @returns {WasmVec2}
     */
    get size() {
        const ret = wasm.__wbg_get_scenecamerasettings_size(this.__wbg_ptr);
        return WasmVec2.__wrap(ret);
    }
    /**
     * @param {WasmVec2} arg0
     */
    set size(arg0) {
        _assertClass(arg0, WasmVec2);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_scenecamerasettings_size(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {WasmVec3}
     */
    get look_at() {
        const ret = wasm.__wbg_get_scenecamerasettings_look_at(this.__wbg_ptr);
        return WasmVec3.__wrap(ret);
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
     * @returns {number}
     */
    get distance() {
        const ret = wasm.__wbg_get_scenecamerasettings_distance(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set distance(arg0) {
        wasm.__wbg_set_scenecamerasettings_distance(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {WasmVec3}
     */
    get rotation() {
        const ret = wasm.__wbg_get_scenecamerasettings_rotation(this.__wbg_ptr);
        return WasmVec3.__wrap(ret);
    }
    /**
     * @param {WasmVec3} arg0
     */
    set rotation(arg0) {
        _assertClass(arg0, WasmVec3);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_scenecamerasettings_rotation(this.__wbg_ptr, ptr0);
    }
    constructor() {
        const ret = wasm.scenecamerasettings_new();
        this.__wbg_ptr = ret >>> 0;
        SceneCameraSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const SceneCharacterSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scenecharactersettings_free(ptr >>> 0, 1));

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
    get is_slim() {
        const ret = wasm.__wbg_get_scenecharactersettings_is_slim(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set is_slim(arg0) {
        wasm.__wbg_set_scenecharactersettings_is_slim(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get has_hat_layer() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_hat_layer(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set has_hat_layer(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_hat_layer(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get has_ears() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_ears(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set has_ears(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_ears(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get has_layers() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_layers(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set has_layers(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_layers(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get has_cape() {
        const ret = wasm.__wbg_get_scenecharactersettings_has_cape(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set has_cape(arg0) {
        wasm.__wbg_set_scenecharactersettings_has_cape(this.__wbg_ptr, arg0);
    }
    constructor() {
        const ret = wasm.scenecharactersettings_new();
        this.__wbg_ptr = ret >>> 0;
        SceneCharacterSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const SceneLightingSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scenelightingsettings_free(ptr >>> 0, 1));

export class SceneLightingSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
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
     * @returns {WasmVec3}
     */
    get direction() {
        const ret = wasm.__wbg_get_scenelightingsettings_direction(this.__wbg_ptr);
        return WasmVec3.__wrap(ret);
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
     * @returns {number}
     */
    get intensity() {
        const ret = wasm.__wbg_get_scenelightingsettings_intensity(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set intensity(arg0) {
        wasm.__wbg_set_scenelightingsettings_intensity(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get ambient() {
        const ret = wasm.__wbg_get_scenelightingsettings_ambient(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set ambient(arg0) {
        wasm.__wbg_set_scenelightingsettings_ambient(this.__wbg_ptr, arg0);
    }
    constructor() {
        const ret = wasm.scenelightingsettings_new();
        this.__wbg_ptr = ret >>> 0;
        SceneLightingSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const SceneMovementSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scenemovementsettings_free(ptr >>> 0, 1));

export class SceneMovementSettings {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SceneMovementSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scenemovementsettings_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get limb_swing() {
        const ret = wasm.__wbg_get_scenemovementsettings_limb_swing(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set limb_swing(arg0) {
        wasm.__wbg_set_scenemovementsettings_limb_swing(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get body_yaw() {
        const ret = wasm.__wbg_get_scenemovementsettings_body_yaw(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set body_yaw(arg0) {
        wasm.__wbg_set_scenemovementsettings_body_yaw(this.__wbg_ptr, arg0);
    }
    constructor() {
        const ret = wasm.scenemovementsettings_new();
        this.__wbg_ptr = ret >>> 0;
        SceneMovementSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const WasmVec2Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmvec2_free(ptr >>> 0, 1));

export class WasmVec2 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
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
        const ret = wasm.__wbg_get_scenemovementsettings_limb_swing(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set 0(arg0) {
        wasm.__wbg_set_scenemovementsettings_limb_swing(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get 1() {
        const ret = wasm.__wbg_get_scenemovementsettings_body_yaw(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set 1(arg0) {
        wasm.__wbg_set_scenemovementsettings_body_yaw(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        const ret = wasm.wasmvec2_new(x, y);
        this.__wbg_ptr = ret >>> 0;
        WasmVec2Finalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const WasmVec3Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmvec3_free(ptr >>> 0, 1));

export class WasmVec3 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
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
        const ret = wasm.__wbg_get_scenemovementsettings_limb_swing(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set 0(arg0) {
        wasm.__wbg_set_scenemovementsettings_limb_swing(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get 1() {
        const ret = wasm.__wbg_get_scenemovementsettings_body_yaw(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set 1(arg0) {
        wasm.__wbg_set_scenemovementsettings_body_yaw(this.__wbg_ptr, arg0);
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
        this.__wbg_ptr = ret >>> 0;
        WasmVec3Finalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
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
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_getContext_e9cf379449413580 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_df82a4d3437bf1cc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof CanvasRenderingContext2D;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_102(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithu8clampedarrayandsh_7ea6ee082a25bc85 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_putImageData_4c5aa10f3b3e4924 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.putImageData(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_setheight_da683a33fa99843c = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_setwidth_c5fed9f5e7f0b406 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper231 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 52, __wbg_adapter_18);
        return ret;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    cachedUint8ClampedArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('skin-renderer-software_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
