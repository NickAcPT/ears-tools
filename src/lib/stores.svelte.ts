import { derived, fromStore, writable, type Readable, type Writable } from "svelte/store";
import { EarsAnchor, EarsMode, Protrusion, FeatureStatus, TailMode, WingsAnimations, WingsMode, type EarsFeatures, type AlfalfaData, TextureSource, type SnoutSettings } from "./ears-manipulator";
import { untrack } from "svelte";

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

export const emissiveSkin = writable<boolean>(false);

export const manipulatorWizardPageTitle = writable<string | null>(null);
export const manipulatorShowCape = writable<boolean>(true);

export const manipulatorSkinFile = writable<File | null>(null);
export const manipulatorSkinSlimModel = writable<boolean>(false);

export const lastEarsFeatures = writable<EarsFeatures | undefined>(undefined);

export const DEFAULT_SNOUT_SETTINGS: SnoutSettings = {
    width: SNOUT_WIDTH_DEFAULT,
    height: SNOUT_HEIGHT_DEFAULT,
    offset: SNOUT_OFFSET_DEFAULT,
    length: SNOUT_LENGTH_DEFAULT,
    source: SOURCE_DEFAULT
};

const DEFAULT_EARS_FEATURES = {
    ears: {
        mode: EARS_MODE_DEFAULT,
        anchor: EARS_ANCHOR_DEFAULT,
        source: SOURCE_DEFAULT
    },
    tail: {
        mode: TAIL_MODE_DEFAULT,
        segments: TAIL_SEGMENTS_DEFAULT,
        bends: TAIL_BENDS_DEFAULT,
        source: SOURCE_DEFAULT
    },
    snout: undefined,
    wings: {
        mode: WINGS_MODE_DEFAULT,
        animations: WINGS_ANIMATIONS_DEFAULT,
        wings: undefined,
        source: SOURCE_DEFAULT
    },
    protrusions: [],
    protrusionsSource: SOURCE_DEFAULT,
    chestSize: CHEST_SIZE_DEFAULT,
    cape: undefined,
    alfalfa: undefined,
    emissives: {
        enabled: EMISSIVE_DEFAULT,
        palette: []
    },
    dataVersion: DATA_VERSION_DEFAULT
};

class EarsFeaturesHolder {
    current: EarsFeatures = $state(DEFAULT_EARS_FEATURES);
}

export let currentEarsFeatures: EarsFeaturesHolder = new EarsFeaturesHolder();



export function getEarsFeatures(): EarsFeatures {
    return currentEarsFeatures.current;
}

export function setEarsFeatures(features: EarsFeatures | null) {
    if (features === null) {
        resetManipulatorEarsFeatures();
        return;
    }

    if (features.alfalfa) {
        features.alfalfa.data.delete("wings");
        features.alfalfa.data.delete("cape");
    }
    
    currentEarsFeatures.current = features
}

export function resetManipulatorEarsFeatures(resetFile: boolean = false) {
    if (resetFile) {
        manipulatorSkinFile.set(null);
        manipulatorSkinSlimModel.set(false);
    }

    currentEarsFeatures.current = DEFAULT_EARS_FEATURES;
}


export function explicitEffect<T>(fn: () => T, depsFn: () => void) {
    $effect(() => {
        depsFn();
        untrack(fn);
    });
}

function pokePropertiesRecursively<T>(value: T) {
    if (typeof value !== 'object' || value === null) {
        return;
    }

    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            const prop = value[key];
            if (typeof prop === 'object' && prop !== null) {
                pokePropertiesRecursively(prop);
            }
        }
    }
}

export function stateSnapshotReactive<T>(value: T) {
    // Force a read on all properties of the value to make it reactive
    let _ = pokePropertiesRecursively(value);
    
    let snapshot = $state.snapshot(value);
    return snapshot;
}