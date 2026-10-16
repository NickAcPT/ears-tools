import { get } from "svelte/store";
import { apply_features } from "../tools/ears-manipulator/ears_manipulator";
import {
    EarsMode,
    FeatureStatus,
    HeadProtrusion,
    Protrusion,
    TailMode,
    TextureSource,
    WingsMode,
    headProtrusionToProtrusion,
    type EarsFeatures,
    type SnoutSettings,
    type TailSettings,
} from "./ears-manipulator";
import { enumKeys } from "./misc";
import { RenderingSupport, renderingSupport } from "./rendering-support";
import {
    checkWebGpuSupport,
    importSkinRendererModule,
    setupSkinScene,
    type SkinCanvasCameraSettings,
    type SkinCanvasCharacterSettings,
    type SkinRendererModule,
    type SkinCanvasSunSettings,
} from "./skin-canvas";
import {
    earsFeatures,
    manipulatorSkinSlimModel,
    snoutHeight,
    snoutLength,
    snoutOffset,
    snoutSource,
    snoutWidth,
    tailBends,
    tailSegments,
} from "./stores";

export interface ManipulatorPreviewSource {
    skin: Uint8Array;
    features: EarsFeatures;
    slimArms: boolean;
    /** The snout an enabled snout gets, also while the skin has none. */
    snout: SnoutSettings;
    /** The shape tails get. */
    tail: Pick<TailSettings, "segments" | "bends">;
}

/** Object URLs of the rendered previews, keyed by enum picker kind and then by enum value. */
export type ManipulatorPreviews = Partial<Record<string, Record<number, string>>>;

type BodyPart = "head" | "body" | "rightArm" | "leftArm" | "rightLeg" | "leftLeg";

interface PreviewTarget {
    elements: Record<string, number | string>;
    focus: BodyPart[];
    rotation: [number, number, number];
    lookAt: [number, number, number];
    /** Wings are only rendered with a texture, so a placeholder is used when the skin has none. */
    needsWingsTexture?: boolean;
    apply(features: EarsFeatures, value: number, source: ManipulatorPreviewSource): void;
    /**
     * Builds an extra render used only to find the region to frame: the difference to it must cover everything the
     * options add, even where the options look alike.
     */
    reference?(features: EarsFeatures): void;
    /** Options with the same group share their framing; all options share one framing by default. */
    framingGroup?(value: number): string;
}

interface Box {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

/** Square render resolution; the previews are cropped out of it. Must be a multiple of 4. */
const RENDER_SIZE = 320;
/** Focal length in pixels; the renderer uses a 45° vertical field of view. */
const FOCAL_LENGTH = RENDER_SIZE / 2 / Math.tan(Math.PI / 8);
const INITIAL_DISTANCE = 40;
/** Keeps the camera out of the model. */
const MIN_DISTANCE = 12;
/** Keeps the model in front of the renderer's far plane, which sits at around 100 units. */
const MAX_DISTANCE = 80;
/** Upper bound of renders of all variants spent on framing a picker. */
const FIT_ATTEMPTS = 8;
/** Share of the render the content should span; leaves room for perspective making the estimates optimistic. */
const TARGET_FILL = 0.95;
/** The framing is good enough once the content spans this share of the render and is centered within a few pixels. */
const SUFFICIENT_FILL = 0.88;
const SUFFICIENT_CENTERING = 3;
/** Pixels kept free around the content, so antialiased edges are not cut off. */
const CONTENT_MARGIN = 2;
/** Per-channel difference above which a pixel counts as changed. */
const DIFF_THRESHOLD = 8;

/** Yaw of the light relative to the camera, as in the interactive skin canvas (camera at 20°, light at 0°). */
const LIGHT_YAW_OFFSET = -20;

/** Base and overlay UV rectangles ([x, y, width, height]) of each body part on a 64x64 skin. */
const BODY_PART_UVS: Record<BodyPart, [number, number, number, number][]> = {
    head: [
        [0, 0, 32, 16],
        [32, 0, 32, 16],
    ],
    body: [
        [16, 16, 24, 16],
        [16, 32, 24, 16],
    ],
    rightArm: [
        [40, 16, 16, 16],
        [40, 32, 16, 16],
    ],
    leftArm: [
        [32, 48, 16, 16],
        [48, 48, 16, 16],
    ],
    rightLeg: [
        [0, 16, 16, 16],
        [0, 32, 16, 16],
    ],
    leftLeg: [
        [16, 48, 16, 16],
        [0, 48, 16, 16],
    ],
};

const HEAD_CENTER: [number, number, number] = [0, 28, 0];
const BODY_CENTER: [number, number, number] = [0, 18, 0];
const MODEL_CENTER: [number, number, number] = [0, 16, 0];

const PREVIEW_TARGETS: Record<string, PreviewTarget> = {
    "ears-mode": {
        elements: EarsMode,
        focus: ["head"],
        rotation: [35, 15, 0],
        lookAt: HEAD_CENTER,
        apply: (features, value) => (features.ears.mode = value),
        // Tall ears would leave the others small, so they get their own framing
        framingGroup: (value) => (value === EarsMode.Tall || value === EarsMode.TallCross ? "tall" : "short"),
        // Frames whole ears; diffing two similar tall ears against each other alone only covers where they differ
        reference: (features) => (features.ears.mode = EarsMode.None),
    },
    "snout-mode": {
        elements: FeatureStatus,
        focus: ["head"],
        rotation: [55, 5, 0],
        lookAt: HEAD_CENTER,
        apply: (features, value, source) => (features.snout = value === FeatureStatus.Enabled ? source.snout : undefined),
    },
    "tail-mode": {
        elements: TailMode,
        focus: ["body"],
        rotation: [-130, 10, 0],
        lookAt: BODY_CENTER,
        apply: (features, value, source) => (features.tail = { ...features.tail, ...source.tail, mode: value }),
    },
    "protrusion-claws": {
        elements: FeatureStatus,
        focus: ["head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg"],
        rotation: [25, 10, 0],
        lookAt: MODEL_CENTER,
        apply: (features, value) => {
            features.protrusions = features.protrusions.filter((protrusion) => protrusion !== Protrusion.Claws);
            if (value === FeatureStatus.Enabled) features.protrusions.push(Protrusion.Claws);
        },
    },
    "protrusion-head": {
        elements: HeadProtrusion,
        focus: ["head"],
        // Looking from above, so halos are not seen edge-on
        rotation: [25, 35, 0],
        lookAt: HEAD_CENTER,
        apply: (features, value) => {
            features.protrusions = features.protrusions.filter((protrusion) => protrusion === Protrusion.Claws);
            const protrusion = headProtrusionToProtrusion(value);
            if (protrusion !== undefined) features.protrusions.push(protrusion);
        },
    },
    "wings-mode": {
        elements: WingsMode,
        focus: ["body"],
        rotation: [-155, 15, 0],
        lookAt: BODY_CENTER,
        needsWingsTexture: true,
        apply: (features, value) => (features.wings.mode = value),
    },
};

export function captureManipulatorPreviewSource(skin: Uint8Array): ManipulatorPreviewSource {
    return {
        skin,
        features: structuredClone(get(earsFeatures)),
        slimArms: get(manipulatorSkinSlimModel),
        snout: { width: get(snoutWidth), height: get(snoutHeight), length: get(snoutLength), offset: get(snoutOffset), source: get(snoutSource) },
        // The bends array is mutated in place by the tail page, so the source needs its own copy
        tail: { segments: get(tailSegments), bends: get(tailBends).slice() },
    };
}

/** Picker kinds whose previews differ between two sources. */
export function changedPreviewKinds(previous: ManipulatorPreviewSource | null, next: ManipulatorPreviewSource): string[] {
    if (!previous || previous.skin !== next.skin || previous.features !== next.features || previous.slimArms !== next.slimArms) {
        return Object.keys(PREVIEW_TARGETS);
    }
    return [...(previous.snout !== next.snout ? ["snout-mode"] : []), ...(previous.tail !== next.tail ? ["tail-mode"] : [])];
}

interface PreviewRenderer {
    module: SkinRendererModule;
    canvas: HTMLCanvasElement;
    context: OffscreenCanvasRenderingContext2D;
    /** Settles once the last queued shot is done; the renderer holds a single scene, so shots must not interleave. */
    queue: Promise<unknown>;
}

let previewRenderer: Promise<PreviewRenderer> | null = null;

/**
 * A single hidden renderer, separate from the interactive skin canvas, shared by every preview.
 * Starts at the rendering support the skin canvas settled on and falls back on its own.
 */
function getPreviewRenderer(): Promise<PreviewRenderer> {
    previewRenderer ??= (async () => {
        let lastError: unknown;
        for (let support = get(renderingSupport); support <= RenderingSupport.SoftwareRendering; support++) {
            try {
                if (support === RenderingSupport.WebGPU && !(await checkWebGpuSupport())) {
                    throw new Error("WebGPU is not supported");
                }

                const module = await importSkinRendererModule(support, true);
                await module.default();

                // A canvas can only ever hold one kind of context, so every attempt gets a new one
                const canvas = document.createElement("canvas");
                await module.initialize(canvas, RENDER_SIZE, RENDER_SIZE);
                canvas.width = RENDER_SIZE;
                canvas.height = RENDER_SIZE;

                const context = new OffscreenCanvas(RENDER_SIZE, RENDER_SIZE).getContext("2d", { willReadFrequently: true });
                if (!context) throw new Error("Unable to create a 2D canvas context");

                return { module, canvas, context, queue: Promise.resolve() };
            } catch (e) {
                console.log("Unable to set up the preview renderer with", RenderingSupport[support], e);
                lastError = e;
            }
        }
        previewRenderer = null;
        throw lastError;
    })();
    return previewRenderer;
}

function renderShot(
    renderer: PreviewRenderer,
    camera: SkinCanvasCameraSettings,
    character: SkinCanvasCharacterSettings,
    skin: Uint8Array
): Promise<ImageData> {
    const shot = renderer.queue.then(() => renderQueuedShot(renderer, camera, character, skin));
    renderer.queue = shot.catch(() => undefined);
    return shot;
}

async function renderQueuedShot(
    renderer: PreviewRenderer,
    camera: SkinCanvasCameraSettings,
    character: SkinCanvasCharacterSettings,
    skin: Uint8Array
): Promise<ImageData> {
    // Light the side the camera looks at, from above, like the default front view of the skin canvas
    const lightYaw = ((camera.rotation[0] + LIGHT_YAW_OFFSET) * Math.PI) / 180;
    const sun: SkinCanvasSunSettings = { direction: [-Math.sin(lightYaw), 1.0, Math.cos(lightYaw)], renderShading: true };
    await setupSkinScene(renderer.module, [RENDER_SIZE, RENDER_SIZE], camera, sun, character, skin);
    await renderer.module.render_frame();

    // Copy right after rendering, before the canvas gets presented and its drawing buffer may be discarded
    renderer.context.clearRect(0, 0, RENDER_SIZE, RENDER_SIZE);
    renderer.context.drawImage(renderer.canvas, 0, 0);
    return renderer.context.getImageData(0, 0, RENDER_SIZE, RENDER_SIZE);
}

function diffBox(a: ImageData, b: ImageData): Box | null {
    let x0 = RENDER_SIZE;
    let y0 = RENDER_SIZE;
    let x1 = -1;
    let y1 = -1;
    for (let y = 0; y < RENDER_SIZE; y++) {
        for (let x = 0; x < RENDER_SIZE; x++) {
            const i = (y * RENDER_SIZE + x) * 4;
            if (
                Math.abs(a.data[i] - b.data[i]) > DIFF_THRESHOLD ||
                Math.abs(a.data[i + 1] - b.data[i + 1]) > DIFF_THRESHOLD ||
                Math.abs(a.data[i + 2] - b.data[i + 2]) > DIFF_THRESHOLD ||
                Math.abs(a.data[i + 3] - b.data[i + 3]) > DIFF_THRESHOLD
            ) {
                x0 = Math.min(x0, x);
                y0 = Math.min(y0, y);
                x1 = Math.max(x1, x);
                y1 = Math.max(y1, y);
            }
        }
    }
    return x1 < 0 ? null : { x0, y0, x1, y1 };
}

function unionBox(a: Box | null, b: Box | null): Box | null {
    if (!a || !b) return a ?? b;
    return { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) };
}

function createPng(draw: (context: OffscreenCanvasRenderingContext2D) => void, width: number, height: number): Promise<Blob> {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to create a 2D canvas context");
    draw(context);
    return canvas.convertToBlob({ type: "image/png" });
}

/**
 * Two fully opaque flat skins that only differ on the given body parts; diffing their renders yields where the
 * parts end up on screen, overlay included.
 */
async function createFocusSkins(focus: BodyPart[]): Promise<[Uint8Array, Uint8Array]> {
    const flat = (context: OffscreenCanvasRenderingContext2D) => {
        context.fillStyle = "#808080";
        context.fillRect(0, 0, 64, 64);
    };
    const neutral = await createPng(flat, 64, 64);
    const marked = await createPng(
        (context) => {
            flat(context);
            context.fillStyle = "#ff0000";
            for (const [x, y, width, height] of focus.flatMap((part) => BODY_PART_UVS[part])) {
                context.fillRect(x, y, width, height);
            }
        },
        64,
        64
    );
    return [new Uint8Array(await neutral.arrayBuffer()), new Uint8Array(await marked.arrayBuffer())];
}

/** A 20x16 neutral wing texture with a darker outline. */
async function createPlaceholderWings(): Promise<Uint8Array> {
    const png = await createPng(
        (context) => {
            context.fillStyle = "#606060";
            context.fillRect(0, 0, 20, 16);
            context.fillStyle = "#b0b0b0";
            context.fillRect(1, 1, 18, 14);
        },
        20,
        16
    );
    return new Uint8Array(await png.arrayBuffer());
}

/** Extra renders that only decide which region of the render to frame. */
interface Framing {
    /** See `createFocusSkins`. */
    focusSkins: [Uint8Array, Uint8Array];
    /** See `PreviewTarget.reference`. */
    reference?: Uint8Array;
}

/**
 * Renders every variant plus the framing skins with the given camera, returning the variant renders and the screen
 * region covering both the focused body parts and everything that differs between the variants.
 */
async function renderVariants(
    renderer: PreviewRenderer,
    camera: SkinCanvasCameraSettings,
    slimArms: boolean,
    framing: Framing,
    variants: Uint8Array[]
): Promise<{ images: ImageData[]; box: Box | null }> {
    const focusCharacter = { renderEars: false, renderLayers: true, slimArms, showCape: false };
    const neutral = await renderShot(renderer, camera, focusCharacter, framing.focusSkins[0]);
    const marked = await renderShot(renderer, camera, focusCharacter, framing.focusSkins[1]);

    const character = { renderEars: true, renderLayers: true, slimArms, showCape: false };
    const images: ImageData[] = [];
    for (const variant of variants) {
        images.push(await renderShot(renderer, camera, character, variant));
    }

    let box = diffBox(neutral, marked);
    for (const image of images.slice(1)) {
        box = unionBox(box, diffBox(images[0], image));
    }
    if (framing.reference) {
        box = unionBox(box, diffBox(images[0], await renderShot(renderer, camera, character, framing.reference)));
    }
    return { images, box };
}

function touchesEdge(box: Box) {
    return box.x0 < CONTENT_MARGIN || box.y0 < CONTENT_MARGIN || box.x1 >= RENDER_SIZE - CONTENT_MARGIN || box.y1 >= RENDER_SIZE - CONTENT_MARGIN;
}

/**
 * Centers the camera on the focused body part plus all the changes and zooms in until they fill the render, then
 * crops every variant to that region.
 */
async function renderTargetPreviews(
    renderer: PreviewRenderer,
    target: PreviewTarget,
    slimArms: boolean,
    variants: Uint8Array[],
    reference: Uint8Array | undefined,
    isCancelled: () => boolean
): Promise<Blob[] | null> {
    const framing: Framing = { focusSkins: await createFocusSkins(target.focus), reference };
    const center = RENDER_SIZE / 2;
    const yaw = (target.rotation[0] * Math.PI) / 180;
    const pitch = (target.rotation[1] * Math.PI) / 180;

    let camera: SkinCanvasCameraSettings = { rotation: target.rotation, look_at: target.lookAt, distance: INITIAL_DISTANCE };
    let result = await renderVariants(renderer, camera, slimArms, framing, variants);
    // The render where the content is the largest without being cut off by the edges
    let best: { images: ImageData[]; box: Box; extent: number } | null = null;

    for (let attempt = 1; attempt < FIT_ATTEMPTS && result.box; attempt++) {
        if (isCancelled()) return null;

        if (touchesEdge(result.box)) {
            if (camera.distance >= MAX_DISTANCE) break;
            // Back off; in big steps until the content was seen whole once
            camera = { ...camera, distance: Math.min(MAX_DISTANCE, camera.distance * (best ? 1.15 : 1.5)) };
        } else {
            const box = result.box;
            const offsetX = (box.x0 + box.x1 + 1) / 2 - center;
            const offsetY = (box.y0 + box.y1 + 1) / 2 - center;
            const extent = Math.max(box.x1 + 1 - box.x0, box.y1 + 1 - box.y0) / 2;
            const fill = extent / (center - CONTENT_MARGIN);

            if (!best || extent > best.extent) best = { images: result.images, box, extent };
            if (fill >= SUFFICIENT_FILL && Math.abs(offsetX) <= SUFFICIENT_CENTERING && Math.abs(offsetY) <= SUFFICIENT_CENTERING) break;

            // Move the look-at point by the world distance the content is off-center by at the look-at depth.
            // The camera's right axis is (-cos(yaw), 0, -sin(yaw)); vertical offsets are moved along the world Y axis.
            // Content in front of or behind the look-at point makes this inexact, which the next attempts correct.
            const unitsPerPixel = camera.distance / FOCAL_LENGTH;
            camera = {
                rotation: camera.rotation,
                look_at: [
                    camera.look_at[0] - Math.cos(yaw) * offsetX * unitsPerPixel,
                    camera.look_at[1] - (offsetY * unitsPerPixel) / Math.cos(pitch),
                    camera.look_at[2] - Math.sin(yaw) * offsetX * unitsPerPixel,
                ],
                // Apparent size is roughly inversely proportional to the distance
                distance: Math.min(MAX_DISTANCE, Math.max(MIN_DISTANCE, (camera.distance * fill) / TARGET_FILL)),
            };
        }

        result = await renderVariants(renderer, camera, slimArms, framing, variants);
    }

    if (result.box && !touchesEdge(result.box)) {
        const extent = Math.max(result.box.x1 + 1 - result.box.x0, result.box.y1 + 1 - result.box.y0) / 2;
        if (!best || extent > best.extent) best = { images: result.images, box: result.box, extent };
    }
    if (best) result = best;

    if (isCancelled()) return null;

    // Square crop around the content; the render is square, so shifting it inside the render always fits
    const box = result.box ?? { x0: 0, y0: 0, x1: RENDER_SIZE - 1, y1: RENDER_SIZE - 1 };
    const size = Math.min(RENDER_SIZE, Math.max(box.x1 + 1 - box.x0, box.y1 + 1 - box.y0) + 2 * CONTENT_MARGIN);
    const x = Math.min(RENDER_SIZE - size, Math.max(0, Math.round((box.x0 + box.x1 + 1 - size) / 2)));
    const y = Math.min(RENDER_SIZE - size, Math.max(0, Math.round((box.y0 + box.y1 + 1 - size) / 2)));

    return Promise.all(result.images.map((image) => createPng((context) => context.putImageData(image, -x, -y), size, size)));
}

/**
 * Renders a preview image for every option of the given enum pickers, using one hidden renderer for all of them, and
 * hands each picker's previews over as soon as they are ready. Skips the pickers `isCancelled` returns true for.
 */
export async function generateManipulatorPreviews(
    source: ManipulatorPreviewSource,
    kinds: string[],
    isCancelled: (kind: string) => boolean,
    onRendered: (kind: string, previews: Record<number, string>) => void
) {
    const renderer = await getPreviewRenderer();

    let baseWingsFeatures: EarsFeatures = source.features;
    if (!source.features.wings.wings) {
        baseWingsFeatures = structuredClone(source.features);
        baseWingsFeatures.wings.wings = await createPlaceholderWings();
        baseWingsFeatures.wings.source = TextureSource.YourSkin;
    }

    for (const kind of kinds) {
        const target = PREVIEW_TARGETS[kind];
        if (isCancelled(kind)) continue;

        const groups = new Map<string, { values: number[]; variants: Uint8Array[] }>();
        let reference: Uint8Array | undefined;
        const baseFeatures = target.needsWingsTexture ? baseWingsFeatures : source.features;
        try {
            for (const key of enumKeys(target.elements)) {
                const value = target.elements[key] as number;
                const features = structuredClone(baseFeatures);
                target.apply(features, value, source);
                const groupKey = target.framingGroup?.(value) ?? "";
                const group = groups.get(groupKey) ?? { values: [], variants: [] };
                group.values.push(value);
                group.variants.push(apply_features(source.skin, features, source.slimArms));
                groups.set(groupKey, group);
            }
            if (target.reference) {
                const features = structuredClone(baseFeatures);
                target.reference(features);
                reference = apply_features(source.skin, features, source.slimArms);
            }
        } catch (e) {
            console.error(`Unable to apply the ${kind} preview features`, e);
            continue;
        }

        const rendered: [number, Blob][] = [];
        for (const { values, variants } of groups.values()) {
            const images = await renderTargetPreviews(renderer, target, source.slimArms, variants, reference, () => isCancelled(kind));
            if (!images) break;
            rendered.push(...values.map((value, i): [number, Blob] => [value, images[i]]));
        }
        // Object URLs are only created when they are handed over, so a cancelled generation leaks none
        if (isCancelled(kind)) continue;
        onRendered(kind, Object.fromEntries(rendered.map(([value, image]) => [value, URL.createObjectURL(image)])));
    }
}

export function revokeManipulatorPreviews(previews: ManipulatorPreviews) {
    for (const urls of Object.values(previews)) {
        for (const url of Object.values(urls ?? {})) {
            URL.revokeObjectURL(url);
        }
    }
}
