import { derived, writable } from "svelte/store";
import { EarsAnchor, EarsMode, Protrusion, SnoutStatus, TailMode, WingsAnimations, WingsMode } from "./ears-manipulator";

export const earsRegionEditorCurrentFile = writable<File | null>(null);

const SNOUT_DEFAULT = SnoutStatus.Disabled;
const SNOUT_WIDTH_DEFAULT = 1;
const SNOUT_HEIGHT_DEFAULT = 1;
const SNOUT_OFFSET_DEFAULT = 0;
const SNOUT_LENGTH_DEFAULT = 1;

const EARS_MODE_DEFAULT = EarsMode.None;
const EARS_ANCHOR_DEFAULT = EarsAnchor.Center;

const TAIL_MODE_DEFAULT = TailMode.None;
const TAIL_SEGMENTS_DEFAULT = 1;
const TAIL_BENDS_DEFAULT = [0, 0, 0, 0];

const WINGS_MODE_DEFAULT = WingsMode.None;
const WINGS_ANIMATIONS_DEFAULT = WingsAnimations.Normal;

const PROTRUSIONS_DEFAULT: Protrusion[] = [];

export const snout = writable(SNOUT_DEFAULT);
export const snoutWidth = writable(SNOUT_WIDTH_DEFAULT);
export const snoutHeight = writable(SNOUT_HEIGHT_DEFAULT);
export const snoutOffset = writable(SNOUT_OFFSET_DEFAULT);
export const snoutLength = writable(SNOUT_LENGTH_DEFAULT);

export const earsMode = writable(EARS_MODE_DEFAULT);
export const earsAnchor = writable(EARS_ANCHOR_DEFAULT);

export const tailMode = writable(TAIL_MODE_DEFAULT);
export const tailSegments = writable(TAIL_SEGMENTS_DEFAULT);
export const tailBends = writable(TAIL_BENDS_DEFAULT.slice());

export const wingsMode = writable(WINGS_MODE_DEFAULT);
export const wingsAnimations = writable(WINGS_ANIMATIONS_DEFAULT);

export const protrusions = writable(PROTRUSIONS_DEFAULT.slice());

export const earsFeatures = derived([earsMode, earsAnchor, tailMode, tailSegments, tailBends, snout, snoutWidth, snoutHeight, snoutOffset, snoutLength, wingsMode, wingsAnimations, protrusions], ([$ears, $earsAnchor, $tail, $tailSegments, $tailBends, $snout, $snoutWidth, $snoutHeight, $snoutOffset, $snoutLength, $wings, $wingsAnimations, $protrusions]) => ({
    ears: {
        mode: $ears,
        anchor: $earsAnchor
    },
    tail: {
        mode: $tail,
        segments: $tailSegments,
        bends: $tailBends
    },
    ...($snout === SnoutStatus.Enabled ? {
        snout: {
            width: $snoutWidth,
            height: $snoutHeight,
            offset: $snoutOffset,
            length: $snoutLength
        }
    } : {}),
    wings: {
        mode: $wings,
        animations: $wingsAnimations
    },
    protrusions: $protrusions
}));

export function resetManipulatorEarsFeatures() {
    earsMode.set(EARS_MODE_DEFAULT);
    earsAnchor.set(EARS_ANCHOR_DEFAULT);
    tailMode.set(TAIL_MODE_DEFAULT);
    tailSegments.set(TAIL_SEGMENTS_DEFAULT);
    tailBends.set(TAIL_BENDS_DEFAULT.slice());
    snout.set(SNOUT_DEFAULT);
    snoutWidth.set(SNOUT_WIDTH_DEFAULT);
    snoutHeight.set(SNOUT_HEIGHT_DEFAULT);
    snoutOffset.set(SNOUT_OFFSET_DEFAULT);
    snoutLength.set(SNOUT_LENGTH_DEFAULT);
    wingsMode.set(WINGS_MODE_DEFAULT);
    wingsAnimations.set(WINGS_ANIMATIONS_DEFAULT);
    protrusions.set(PROTRUSIONS_DEFAULT.slice());
}