// @ts-check
export { };

//let renderModeSelect = /** @type {HTMLSelectElement} */ (document.getElementById("render-mode"));
let slimArmsChk = /** @type {HTMLInputElement} */ (document.getElementById("slim-arms"));
let renderShadingChk = /** @type {HTMLInputElement} */ (document.getElementById("render-shading"));
let renderLayersChk = /** @type {HTMLInputElement} */ (document.getElementById("render-layers"));
let renderEarsChk = /** @type {HTMLInputElement} */ (document.getElementById("render-ears"));
let picker = /** @type {HTMLInputElement} */ (document.getElementById("file-picker"));
let demoSkinBtn = /** @type {HTMLButtonElement} */ (document.getElementById("demo-skin"));
let loadingLbl = /** @type {HTMLParagraphElement} */ (document.getElementById("loading"));
let outCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("out"));

let hasWebGpu = false;

try {
    let tempCanvas = document.createElement("canvas");

    hasWebGpu = tempCanvas.getContext("webgpu") != null && new URL(document.location).searchParams.get("webgpu") !== "false";
} catch (e) {
    // No-op
}

const jsName = "skin-renderer-software_wasm.js";//hasWebGpu ? "skin-renderer_wasm.js" : "skin-renderer-webgl_wasm.js";

/**
 * @type {import("./skin-renderer-software_wasm.js")}
 */
const module = await import(`./${jsName}`);

/**
 * @type {import("./skin-renderer-software_wasm.js").default}
 */
const init = module.default;
/**
 * @type {import("./skin-renderer-software_wasm.js")}
 */
const { initialize, get_camera, get_sun, setup_scene, render_frame, set_camera_z, SceneCameraSettings, SceneCharacterSettings, SceneLightingSettings, WasmVec2, WasmVec3 } = module;

document.getElementById("slider").addEventListener("input", function (e) {
    set_camera_z(parseFloat(e.target.value));
});
    

notifyLoading(true);
try {
    await init();

    await initialize(outCanvas, parseInt(outCanvas.dataset.width), parseInt(outCanvas.dataset.height));
} catch (e) {
    console.error(e);
    // Add query param to reload the page without webgpu
    window.location.search = "?webgpu=false";
}

function vec2(x, y) {
    let vec = new WasmVec2(x, y);
    return vec;
}

function vec3(x, y, z) {
    return new WasmVec3(x, y, z);
}
/**
 * 
 * @param {PointerEvent} e 
 * @returns 
 */
async function handlePointerDown(e) {
    e.preventDefault();
    outCanvas.setPointerCapture(e.pointerId);
    if (module == null) return;
    await module.notify_mouse_down();
}
/**
 * 
 * @param {PointerEvent} e 
 * @returns 
 */
async function handlePointerUp(e) {
    e.preventDefault();
    outCanvas.releasePointerCapture(e.pointerId);
    if (module == null) return;
    await module.notify_mouse_up();
}
/**
 * 
 * @param {PointerEvent} e 
 * @returns 
 */
async function handlePointerMove(e) {
    e.preventDefault();
    if (module == null) return;
    await module.notify_mouse_move(e.clientX, e.clientY);
}
/**
 * 
 * @param {WheelEvent} e 
 * @returns 
 */
async function handleScroll(e) {
    e.preventDefault();
    if (module == null) return;
    await module.notify_mouse_scroll(-e.deltaY / 20);
}

/**
 * 
 * @param {TouchEvent} e 
 */
async function handleTouchStart(e) {
    e.preventDefault();
    await handlePointerDown(new PointerEvent("pointerdown", e));
}

/**
 * 
 * @param {TouchEvent} e 
 */
async function handleTouchEnd(e) {
    e.preventDefault();
    await handlePointerUp(new PointerEvent("pointerup", e));
}

/** @type {number | undefined} */
let lastDist = undefined;
/**
 * 
 * @param {TouchEvent} e 
 */
async function handleTouchMove(e) {
    e.preventDefault();
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
function canvasSize() {
    outCanvas.width = outCanvas.dataset.width;
    outCanvas.height = outCanvas.dataset.height;
    return vec2(outCanvas.dataset.width, outCanvas.dataset.height);
}

outCanvas.addEventListener("pointerdown", handlePointerDown);
outCanvas.addEventListener("pointerup", handlePointerUp);
outCanvas.addEventListener("pointermove", handlePointerMove);
outCanvas.addEventListener("wheel", handleScroll);
outCanvas.addEventListener("touchstart", handleTouchStart);
outCanvas.addEventListener("touchend", handleTouchEnd);	
outCanvas.addEventListener("touchmove", handleTouchMove);

notifyLoading(false);

async function render() {
    render_frame();
    window.requestAnimationFrame(render);
}

setTimeout(function () {
    window.requestAnimationFrame(render);
}, 1);

async function loadDemoSkin() {
    let response = await fetch("skin.png");
    let data = await response.arrayBuffer();

    let list = new DataTransfer();
    let file = new File([data], "demo-skin.png");
    list.items.add(file);

    picker.files = list.files;

    // Demo skin is slim arms
    slimArmsChk.checked = true;

    // Demo skin has Ears
    renderEarsChk.checked = true;

    onUpdate();
}
demoSkinBtn.addEventListener("click", loadDemoSkin);

let camera = {
    rotation: [20, 10, 0],
    distance: 45.0,
    look_at: [0, 16.5, 0]
};

let sun = {
    direction: [0.0, 1.0, 1.0],
    renderShading: true,
    intensity: 2.0
};

let lastRotationId = undefined;
let loadedBefore = false;

async function onUpdate() {
    if (picker.files && picker.files[0]) {
        let reader = new FileReader();
        reader.onload = async function (e) {
            if (!e || !e.target || !e.target.result) return;

            let data = new Uint8Array(/** @type {ArrayBufferLike} */(e.target.result))

            if (lastRotationId) {
                clearInterval(lastRotationId);
            }

            if (loadedBefore) {
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
            character.has_ears = renderEarsChk.checked;
            character.has_hat_layer = renderLayersChk.checked;
            character.has_layers = renderLayersChk.checked;
            character.is_slim = slimArmsChk.checked;

            await setup_scene(settings, lighting, character, data);
            loadedBefore = true;

            /* lastRotationId = setInterval(function () {
                camera.rotation[0] += 1;
                set_camera_rotation(camera.rotation[0], camera.rotation[1], camera.rotation[2]);
            }, 7); */
        }
        reader.readAsArrayBuffer(picker.files[0])
    }
}

renderShadingChk.addEventListener("change", function () {
    sun.renderShading = renderShadingChk.checked;
    onUpdate();
});

// On file change, load the file and render it
picker.addEventListener("change", function () {
    onUpdate()
})

await loadDemoSkin();

// On render mode change, re-initialize the parts manager
/* renderModeSelect.addEventListener("change", function () {
    onUpdate();
}) */

// On checkbox change, render the current file
document.querySelectorAll("input[type=checkbox]").forEach(function (el) {
    el.addEventListener("change", function () {
        onUpdate()
    })
});

/**
 * @param {boolean} loading
 */
function notifyLoading(loading) {
    document.querySelectorAll("input").forEach(function (el) {
        // Enable all inputs after loading
        el.disabled = loading;
    });

    loadingLbl.style.display = loading ? "block" : "none";
    //renderModeSelect.disabled = loading;
}

