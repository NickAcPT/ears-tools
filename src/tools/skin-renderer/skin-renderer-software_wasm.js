let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

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
                wasm.__wbindgen_export_0.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_16(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures__invoke1_mut__hc90b9b2947ec53e3(arg0, arg1, addHeapObject(arg2));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
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
    return takeObject(ret);
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
    return takeObject(ret);
}

/**
* @returns {Promise<void>}
*/
export function notify_mouse_up() {
    const ret = wasm.notify_mouse_up();
    return takeObject(ret);
}

/**
* @param {number} x
* @param {number} y
* @returns {Promise<void>}
*/
export function notify_mouse_move(x, y) {
    const ret = wasm.notify_mouse_move(x, y);
    return takeObject(ret);
}

/**
* @param {number} delta
* @returns {Promise<void>}
*/
export function notify_mouse_scroll(delta) {
    const ret = wasm.notify_mouse_scroll(delta);
    return takeObject(ret);
}

/**
* @returns {Promise<void>}
*/
export function render_frame() {
    const ret = wasm.render_frame();
    return takeObject(ret);
}

/**
* @param {HTMLCanvasElement} canvas
* @param {number} width
* @param {number} height
* @returns {Promise<void>}
*/
export function initialize(canvas, width, height) {
    const ret = wasm.initialize(addHeapObject(canvas), width, height);
    return takeObject(ret);
}

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
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

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
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedUint8ClampedMemory0 = null;

function getUint8ClampedMemory0() {
    if (cachedUint8ClampedMemory0 === null || cachedUint8ClampedMemory0.byteLength === 0) {
        cachedUint8ClampedMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedMemory0;
}

function getClampedArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ClampedMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_94(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h5960ef675a1f3a2b(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class SceneCameraSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SceneCameraSettings.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scenecamerasettings_free(ptr);
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
    /**
    */
    constructor() {
        const ret = wasm.scenecamerasettings_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}
/**
*/
export class SceneCharacterSettings {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scenecharactersettings_free(ptr);
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
    /**
    */
    constructor() {
        const ret = wasm.scenecharactersettings_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}
/**
*/
export class SceneLightingSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SceneLightingSettings.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scenelightingsettings_free(ptr);
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
    /**
    */
    constructor() {
        const ret = wasm.scenelightingsettings_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}
/**
*/
export class WasmVec2 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmVec2.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmvec2_free(ptr);
    }
    /**
    * @returns {number}
    */
    get 0() {
        const ret = wasm.__wbg_get_wasmvec2_0(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set 0(arg0) {
        wasm.__wbg_set_wasmvec2_0(this.__wbg_ptr, arg0);
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
    set 1(arg0) {
        wasm.__wbg_set_wasmvec2_1(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    constructor(x, y) {
        const ret = wasm.wasmvec2_new(x, y);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}
/**
*/
export class WasmVec3 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmVec3.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmvec3_free(ptr);
    }
    /**
    * @returns {number}
    */
    get 0() {
        const ret = wasm.__wbg_get_wasmvec2_0(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set 0(arg0) {
        wasm.__wbg_set_wasmvec2_0(this.__wbg_ptr, arg0);
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
    set 1(arg0) {
        wasm.__wbg_set_wasmvec2_1(this.__wbg_ptr, arg0);
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
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

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
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
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
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_4d890031a6a5a50c = function(arg0) {
        queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_queueMicrotask_adae4bc085237231 = function(arg0) {
        const ret = getObject(arg0).queueMicrotask;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_bc0a6635c96eca9b = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof CanvasRenderingContext2D;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_putImageData_f157d52a70a206d5 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).putImageData(getObject(arg1), arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_setwidth_a667a942dba6656e = function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_setheight_a747d440760fe5aa = function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_7c5944ea807bf5d3 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithu8clampedarrayandsh_e2b3fce567acd708 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newnoargs_c62ea9419c21fbac = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_90c26b09837aba1c = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_5da1969d7cd31ccd = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_60f57089c7563e81 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_94(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_6e1c6553a82f85b7 = function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_3ab08cd4fbb91ae9 = function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_f0e34d89f33b99fd = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_d3b084224f4774d7 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_9caa27ff917c6860 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_35dfdd59a4da3e74 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper197 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 43, __wbg_adapter_16);
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;
    cachedUint8ClampedMemory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('skin-renderer-software_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
