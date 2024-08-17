import { derived, fromStore, writable, type Readable, type Writable } from "svelte/store";
import { EarsAnchor, EarsMode, Protrusion, FeatureStatus, TailMode, WingsAnimations, WingsMode, type EarsFeatures, type AlfalfaData, TextureSource, type SnoutSettings } from "./ears-manipulator";

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

const CHEST_SIZE_DEFAULT = 0.0;
const EMISSIVE_DEFAULT = false;

const DATA_VERSION_DEFAULT = 1;

const SOURCE_DEFAULT = TextureSource.SampleSkin;

export const manipulatorWizardPageTitle = writable<string | null>(null);
export const manipulatorShowCape = writable<boolean>(true);

export const manipulatorSkinFile = writable<File | null>(null);
export const manipulatorSkinSlimModel = writable<boolean>(false);

export const snout = writable(FEATURE_DEFAULT);
export const claws = writable(FEATURE_DEFAULT);
export const horn = writable(FEATURE_DEFAULT);
export const protrusionsSource = writable(SOURCE_DEFAULT);

export const snoutWidth = writable(SNOUT_WIDTH_DEFAULT);
export const snoutHeight = writable(SNOUT_HEIGHT_DEFAULT);
export const snoutOffset = writable(SNOUT_OFFSET_DEFAULT);
export const snoutLength = writable(SNOUT_LENGTH_DEFAULT);
export const snoutSource = writable(SOURCE_DEFAULT);

export const earsMode = writable(EARS_MODE_DEFAULT);
export const earsAnchor = writable(EARS_ANCHOR_DEFAULT);
export const earsSource = writable(SOURCE_DEFAULT);

export const tailMode = writable(TAIL_MODE_DEFAULT);
export const tailSegments: Writable<1 | 2 | 3 | 4> = writable(TAIL_SEGMENTS_DEFAULT);
export const tailBends = writable(TAIL_BENDS_DEFAULT.slice());
export const tailSource = writable(SOURCE_DEFAULT);

export const wingsMode = writable(WINGS_MODE_DEFAULT);
export const wingsAnimations = writable(WINGS_ANIMATIONS_DEFAULT);
export const wingsSource = writable(SOURCE_DEFAULT);

export const chestSize = writable(CHEST_SIZE_DEFAULT);

export const emissiveSkin = writable(EMISSIVE_DEFAULT);
export const emissivePalette = writable<number[] | undefined>(undefined);

export const dataVersion = writable(DATA_VERSION_DEFAULT);

export const wingsImage = writable<Uint8Array | undefined>(undefined);
export const capeImage = writable<Uint8Array | undefined>(undefined);

export const alfalfaData = writable<AlfalfaData | undefined>(undefined);

export const lastEarsFeatures = writable<EarsFeatures | undefined>(undefined);
const earsFeatures: EarsFeatures = $derived({
    ears: {
        mode: fromStore(earsMode).current,
        anchor: fromStore(earsAnchor).current,
        source: fromStore(earsSource).current
    },
    tail: {
        mode: fromStore(tailMode).current,
        segments: fromStore(tailSegments).current,
        bends: fromStore(tailBends).current,
        source: fromStore(tailSource).current
    },
    ...(fromStore(snout).current === FeatureStatus.Enabled ? {
        snout: {
            width: fromStore(snoutWidth).current,
            height: fromStore(snoutHeight).current,
            offset: fromStore(snoutOffset).current,
            length: fromStore(snoutLength).current,
            source: fromStore(snoutSource).current
        }
    } : {}),
    wings: {
        mode: fromStore(wingsMode).current,
        animations: fromStore(wingsAnimations).current,
        wings: fromStore(wingsImage).current,
        source: fromStore(wingsSource).current
    },
    protrusions: [
        ...(fromStore(claws).current === FeatureStatus.Enabled ? [Protrusion.Claws] : []),
        ...(fromStore(horn).current === FeatureStatus.Enabled ? [Protrusion.Horns] : [])
    ],
    protrusionsSource: fromStore(protrusionsSource).current,
    chestSize: fromStore(chestSize).current,
    cape: fromStore(capeImage).current,
    alfalfa: fromStore(alfalfaData).current,
    emissives: {
        enabled: fromStore(emissiveSkin).current,
        palette: fromStore(emissivePalette).current ?? []
    },
    dataVersion: fromStore(dataVersion).current
});

export function getEarsFeatures(): EarsFeatures {
    return earsFeatures;
}


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
    wingsImage.set(features.wings.wings);

    claws.set(features.protrusions.includes(Protrusion.Claws) ? FeatureStatus.Enabled : FeatureStatus.Disabled);
    horn.set(features.protrusions.includes(Protrusion.Horns) ? FeatureStatus.Enabled : FeatureStatus.Disabled);

    chestSize.set(features.chestSize);
    capeImage.set(features.cape);

    alfalfaData.set(features.alfalfa);
    
    emissiveSkin.set(features.emissives.enabled);
    emissivePalette.set(features.emissives.palette);
    
    dataVersion.set(features.dataVersion);
}

export function resetManipulatorEarsFeatures(resetFile: boolean = false) {
    if (resetFile) {
        manipulatorSkinFile.set(null);
        manipulatorSkinSlimModel.set(false);
    }

    earsMode.set(EARS_MODE_DEFAULT);
    earsAnchor.set(EARS_ANCHOR_DEFAULT);
    earsSource.set(SOURCE_DEFAULT);
    
    tailMode.set(TAIL_MODE_DEFAULT);
    tailSegments.set(TAIL_SEGMENTS_DEFAULT);
    tailBends.set(TAIL_BENDS_DEFAULT.slice());
    tailSource.set(SOURCE_DEFAULT);
    
    snout.set(FEATURE_DEFAULT);
    claws.set(FEATURE_DEFAULT);
    horn.set(FEATURE_DEFAULT);
    protrusionsSource.set(SOURCE_DEFAULT);
    
    snoutWidth.set(SNOUT_WIDTH_DEFAULT);
    snoutHeight.set(SNOUT_HEIGHT_DEFAULT);
    snoutOffset.set(SNOUT_OFFSET_DEFAULT);
    snoutLength.set(SNOUT_LENGTH_DEFAULT);
    snoutSource.set(SOURCE_DEFAULT);

    wingsMode.set(WINGS_MODE_DEFAULT);
    wingsAnimations.set(WINGS_ANIMATIONS_DEFAULT);
    wingsImage.set(undefined);
    wingsSource.set(SOURCE_DEFAULT);

    chestSize.set(CHEST_SIZE_DEFAULT);
    
    emissiveSkin.set(EMISSIVE_DEFAULT);
    emissivePalette.set(undefined);
    
    dataVersion.set(DATA_VERSION_DEFAULT);

    capeImage.set(undefined);
    alfalfaData.set(undefined);
}