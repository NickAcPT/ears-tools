import { derived, writable, type Readable, type Writable } from "svelte/store";
import { EarsAnchor, EarsMode, Protrusion, FeatureStatus, TailMode, WingsAnimations, WingsMode, type EarsFeatures } from "./ears-manipulator";

export const earsRegionEditorCurrentFile = writable<File | null>(null);

const FEATURE_DEFAULT = FeatureStatus.Disabled;
const SNOUT_WIDTH_DEFAULT = 1;
const SNOUT_HEIGHT_DEFAULT = 1;
const SNOUT_OFFSET_DEFAULT = 0;
const SNOUT_LENGTH_DEFAULT = 1;

const EARS_MODE_DEFAULT = EarsMode.None;
const EARS_ANCHOR_DEFAULT = EarsAnchor.Center;

const TAIL_MODE_DEFAULT = TailMode.None;
const TAIL_SEGMENTS_DEFAULT: 1 | 2 | 3 | 4 = 1;
const TAIL_BENDS_DEFAULT = [0, 0, 0, 0];

const WINGS_MODE_DEFAULT = WingsMode.None;
const WINGS_ANIMATIONS_DEFAULT = WingsAnimations.Normal;

export const manipulatorWizardPageTitle = writable<string | null>(null);

export const lastManipulatorSkinFile = writable<File | null>(null);
export const manipulatorSkinFile = writable<File | null>(null);
export const manipulatorSkinSlimModel = writable<boolean>(false);

export const snout = writable(FEATURE_DEFAULT);
export const claws = writable(FEATURE_DEFAULT);
export const horn = writable(FEATURE_DEFAULT);

export const snoutWidth = writable(SNOUT_WIDTH_DEFAULT);
export const snoutHeight = writable(SNOUT_HEIGHT_DEFAULT);
export const snoutOffset = writable(SNOUT_OFFSET_DEFAULT);
export const snoutLength = writable(SNOUT_LENGTH_DEFAULT);

export const earsMode = writable(EARS_MODE_DEFAULT);
export const earsAnchor = writable(EARS_ANCHOR_DEFAULT);

export const tailMode = writable(TAIL_MODE_DEFAULT);
export const tailSegments: Writable<1 | 2 | 3 | 4> = writable(TAIL_SEGMENTS_DEFAULT);
export const tailBends = writable(TAIL_BENDS_DEFAULT.slice());

export const wingsMode = writable(WINGS_MODE_DEFAULT);
export const wingsAnimations = writable(WINGS_ANIMATIONS_DEFAULT);

export const lastEarsFeatures = writable<EarsFeatures | null>(null);
export const earsFeatures: Readable<EarsFeatures> = derived([earsMode, earsAnchor, tailMode, tailSegments, tailBends, snout, snoutWidth, snoutHeight, snoutOffset, snoutLength, wingsMode, wingsAnimations, claws, horn], ([$ears, $earsAnchor, $tail, $tailSegments, $tailBends, $snout, $snoutWidth, $snoutHeight, $snoutOffset, $snoutLength, $wings, $wingsAnimations, $claws, $horn]) => ({
    ears: {
        mode: $ears,
        anchor: $earsAnchor
    },
    tail: {
        mode: $tail,
        segments: $tailSegments,
        bends: $tailBends
    },
    ...($snout === FeatureStatus.Enabled ? {
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
    protrusions: [
        ...($claws === FeatureStatus.Enabled ? [Protrusion.Claws] : []),
        ...($horn === FeatureStatus.Enabled ? [Protrusion.Horns] : [])
    ]
}));

export function setEarsFeatures(features: EarsFeatures | null) {
    if (features === null) {
        resetManipulatorEarsFeatures();
        return;
    }
    
    earsMode.set(features.ears.mode);
    earsAnchor.set(features.ears.anchor);
    
    tailMode.set(features.tail.mode);
    tailSegments.set(features.tail.segments);
    tailBends.set(features.tail.bends);
    
    snout.set(features.snout ? FeatureStatus.Enabled : FeatureStatus.Disabled);
    snoutWidth.set(features.snout?.width ?? SNOUT_WIDTH_DEFAULT);
    snoutHeight.set(features.snout?.height ?? SNOUT_HEIGHT_DEFAULT);
    snoutOffset.set(features.snout?.offset ?? SNOUT_OFFSET_DEFAULT);
    snoutLength.set(features.snout?.length ?? SNOUT_LENGTH_DEFAULT);
    
    wingsMode.set(features.wings.mode);
    wingsAnimations.set(features.wings.animations);
    
    claws.set(features.protrusions.includes(Protrusion.Claws) ? FeatureStatus.Enabled : FeatureStatus.Disabled);
    horn.set(features.protrusions.includes(Protrusion.Horns) ? FeatureStatus.Enabled : FeatureStatus.Disabled);
}

export function resetManipulatorEarsFeatures(resetFile: boolean = false) {
    if (resetFile) {
        manipulatorSkinFile.set(null);
        manipulatorSkinSlimModel.set(false);
    }

    earsMode.set(EARS_MODE_DEFAULT);
    earsAnchor.set(EARS_ANCHOR_DEFAULT);
    tailMode.set(TAIL_MODE_DEFAULT);
    tailSegments.set(TAIL_SEGMENTS_DEFAULT);
    tailBends.set(TAIL_BENDS_DEFAULT.slice());
    snout.set(FEATURE_DEFAULT);
    claws.set(FEATURE_DEFAULT);
    horn.set(FEATURE_DEFAULT);
    snoutWidth.set(SNOUT_WIDTH_DEFAULT);
    snoutHeight.set(SNOUT_HEIGHT_DEFAULT);
    snoutOffset.set(SNOUT_OFFSET_DEFAULT);
    snoutLength.set(SNOUT_LENGTH_DEFAULT);
    wingsMode.set(WINGS_MODE_DEFAULT);
    wingsAnimations.set(WINGS_ANIMATIONS_DEFAULT);
}