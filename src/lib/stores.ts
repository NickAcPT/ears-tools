import { derived, writable, type Readable, type Writable } from "svelte/store";
import {
    EarsAnchor,
    EarsMode,
    Protrusion,
    FeatureStatus,
    HeadProtrusion,
    LegMode,
    TailMode,
    WingsAnimations,
    WingsMode,
    LocatorBarIcon,
    LocatorBarIconShape,
    type EarsFeatures,
    type AlfalfaData,
    TextureSource,
    headProtrusionToProtrusion,
} from "./ears-manipulator";
import type { ManipulatorPreviewSource, ManipulatorPreviews } from "./manipulator-previews";

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
const TAIL_ANIMATE_DEFAULT = true;
const TAIL_SWAP_JACKET_BACK_DEFAULT = false;

const WINGS_MODE_DEFAULT = WingsMode.None;
const WINGS_ANIMATIONS_DEFAULT = WingsAnimations.Normal;
const LEG_MODE_DEFAULT = LegMode.Plantigrade;
const HEAD_PROTRUSION_DEFAULT = HeadProtrusion.None;

const CHEST_SIZE_DEFAULT = 0.0;
const EMISSIVE_DEFAULT = false;

const LOCATOR_BAR_ICON_DEFAULT = LocatorBarIcon.MinecraftDefault;
const LOCATOR_BAR_ICON_SHAPE_DEFAULT = LocatorBarIconShape.Dot;
const LOCATOR_BAR_ICON_COLOUR_DEFAULT = "#ffffff";

const DATA_VERSION_DEFAULT = 1;

const SOURCE_DEFAULT = TextureSource.SampleSkin;

export const manipulatorWizardPageTitle = writable<string | null>(null);
export const manipulatorShowCape = writable<boolean>(true);

export const originalManipulatorSkinFile = writable<File | null>(null);
export const manipulatorOutSkinFile = writable<File | null>(null);
export const manipulatorSkinSlimModel = writable<boolean>(false);
export const manipulatorSkinIsGeneratedTemplate = writable<boolean>(false);

/** Skin and features captured when the initial skin is loaded, kept in sync with the slim arms and template preview settings; the enum picker previews are rendered from it. */
export const manipulatorPreviewSource = writable<ManipulatorPreviewSource | null>(null);
export const manipulatorPreviews = writable<ManipulatorPreviews>({});

export const snout = writable(FEATURE_DEFAULT);
export const claws = writable(FEATURE_DEFAULT);
export const headProtrusion = writable(HEAD_PROTRUSION_DEFAULT);
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
export const tailAnimate = writable(TAIL_ANIMATE_DEFAULT);
export const tailSwapJacketBack = writable(TAIL_SWAP_JACKET_BACK_DEFAULT);
export const tailSource = writable(SOURCE_DEFAULT);

export const wingsMode = writable(WINGS_MODE_DEFAULT);
export const wingsAnimations = writable(WINGS_ANIMATIONS_DEFAULT);
export const wingsSource = writable(SOURCE_DEFAULT);
export const legMode = writable(LEG_MODE_DEFAULT);

export const chestSize = writable(CHEST_SIZE_DEFAULT);

export const emissiveSkin = writable(EMISSIVE_DEFAULT);
export const emissivePalette = writable<number[] | undefined>(undefined);

export const dataVersion = writable(DATA_VERSION_DEFAULT);

export const wingsImage = writable<Uint8Array | undefined>(undefined);
export const capeImage = writable<Uint8Array | undefined>(undefined);

export const locatorBarIcon = writable(LOCATOR_BAR_ICON_DEFAULT);
export const locatorBarIconShape = writable(LOCATOR_BAR_ICON_SHAPE_DEFAULT);
export const locatorBarIconColour = writable(LOCATOR_BAR_ICON_COLOUR_DEFAULT);
export const locatorBarCustomImage = writable<Uint8Array | undefined>(undefined);
export const locatorBarImage = writable<Uint8Array | undefined>(undefined);

export const alfalfaData = writable<AlfalfaData | undefined>(undefined);

export const applyTemplate = writable<boolean>(true);

export const lastEarsFeatures = writable<EarsFeatures | undefined>(undefined);
export const earsFeatures: Readable<EarsFeatures> = derived(
    [
        earsMode,
        earsAnchor,
        tailMode,
        tailSegments,
        tailBends,
        tailAnimate,
        tailSwapJacketBack,
        snout,
        snoutWidth,
        snoutHeight,
        snoutOffset,
        snoutLength,
        wingsMode,
        wingsAnimations,
        claws,
        headProtrusion,
        capeImage,
        locatorBarImage,
        wingsImage,
        legMode,
        chestSize,
        alfalfaData,
        earsSource,
        snoutSource,
        wingsSource,
        protrusionsSource,
        tailSource,
        emissiveSkin,
        emissivePalette,
        dataVersion,
        applyTemplate,
    ],
    ([
        $ears,
        $earsAnchor,
        $tail,
        $tailSegments,
        $tailBends,
        $tailAnimate,
        $tailSwapJacketBack,
        $snout,
        $snoutWidth,
        $snoutHeight,
        $snoutOffset,
        $snoutLength,
        $wings,
        $wingsAnimations,
        $claws,
        $headProtrusion,
        $capeImage,
        $locatorBarImage,
        $wingsFile,
        $legMode,
        $chestSize,
        $alfalfaData,
        $earsSource,
        $snoutSource,
        $wingsSource,
        $protrusionsSource,
        $tailSource,
        $emissiveSkin,
        $emissivePalette,
        $dataVersion,
        $applyTemplate,
    ]) => {
        if ($snoutOffset > 8 - $snoutHeight) {
            snoutOffset.set(8 - $snoutHeight);
        }

        const headProtrusionValue = headProtrusionToProtrusion($headProtrusion);

        return {
            ears: {
                mode: $ears,
                anchor: $earsAnchor,
                source: $earsSource,
            },
            tail: {
                mode: $tail,
                segments: $tailSegments,
                bends: $tailBends,
                animate: $tailAnimate,
                swap_jacket_back: $tailSwapJacketBack,
                source: $tailSource,
            },
            ...($snout === FeatureStatus.Enabled
                ? {
                      snout: {
                          width: $snoutWidth,
                          height: $snoutHeight,
                          offset: $snoutOffset,
                          length: $snoutLength,
                          source: $snoutSource,
                      },
                  }
                : {}),
            wings: {
                mode: $wings,
                animations: $wingsAnimations,
                wings: $wingsFile,
                source: $wingsSource,
            },
            protrusions: [
                ...($claws === FeatureStatus.Enabled ? [Protrusion.Claws] : []),
                ...(headProtrusionValue !== undefined ? [headProtrusionValue] : []),
            ],
            protrusionsSource: $protrusionsSource,
            legMode: $legMode,
            chestSize: $chestSize,
            cape: $capeImage,
            locator: $locatorBarImage,
            alfalfa: $alfalfaData,
            emissives: {
                enabled: $emissiveSkin,
                palette: $emissivePalette ?? [],
            },
            dataVersion: $dataVersion,
            applyTemplate: $applyTemplate,
        };
    }
);

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
    tailAnimate.set(features.tail.animate ?? TAIL_ANIMATE_DEFAULT);
    tailSwapJacketBack.set(features.tail.swap_jacket_back ?? TAIL_SWAP_JACKET_BACK_DEFAULT);

    snout.set(features.snout ? FeatureStatus.Enabled : FeatureStatus.Disabled);
    snoutWidth.set(features.snout?.width ?? SNOUT_WIDTH_DEFAULT);
    snoutHeight.set(features.snout?.height ?? SNOUT_HEIGHT_DEFAULT);
    snoutOffset.set(features.snout?.offset ?? SNOUT_OFFSET_DEFAULT);
    snoutLength.set(features.snout?.length ?? SNOUT_LENGTH_DEFAULT);

    wingsMode.set(features.wings.mode);
    wingsAnimations.set(features.wings.animations);
    wingsImage.set(features.wings.wings);

    claws.set(features.protrusions.includes(Protrusion.Claws) ? FeatureStatus.Enabled : FeatureStatus.Disabled);
    headProtrusion.set(
        features.protrusions.includes(Protrusion.DoubleHalo)
            ? HeadProtrusion.DoubleHalo
            : features.protrusions.includes(Protrusion.Halo)
              ? HeadProtrusion.Halo
              : features.protrusions.includes(Protrusion.Horns)
                ? HeadProtrusion.Horns
                : HeadProtrusion.None
    );

    chestSize.set(features.chestSize);
    legMode.set(features.legMode ?? LEG_MODE_DEFAULT);
    capeImage.set(features.cape);

    locatorBarImage.set(features.locator);
    locatorBarCustomImage.set(features.locator);
    locatorBarIcon.set(features.locator ? LocatorBarIcon.CustomImage : LOCATOR_BAR_ICON_DEFAULT);

    alfalfaData.set(features.alfalfa);

    emissiveSkin.set(features.emissives.enabled);
    emissivePalette.set(features.emissives.palette);

    dataVersion.set(features.dataVersion);
}

export function resetManipulatorEarsFeatures(resetFile: boolean = false) {
    if (resetFile) {
        manipulatorOutSkinFile.set(null);
        originalManipulatorSkinFile.set(null);
        manipulatorSkinSlimModel.set(false);
        manipulatorSkinIsGeneratedTemplate.set(false);
        manipulatorPreviewSource.set(null);
    }

    earsMode.set(EARS_MODE_DEFAULT);
    earsAnchor.set(EARS_ANCHOR_DEFAULT);
    earsSource.set(SOURCE_DEFAULT);

    tailMode.set(TAIL_MODE_DEFAULT);
    tailSegments.set(TAIL_SEGMENTS_DEFAULT);
    tailBends.set(TAIL_BENDS_DEFAULT.slice());
    tailAnimate.set(TAIL_ANIMATE_DEFAULT);
    tailSwapJacketBack.set(TAIL_SWAP_JACKET_BACK_DEFAULT);
    tailSource.set(SOURCE_DEFAULT);

    snout.set(FEATURE_DEFAULT);
    claws.set(FEATURE_DEFAULT);
    headProtrusion.set(HEAD_PROTRUSION_DEFAULT);
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
    legMode.set(LEG_MODE_DEFAULT);

    chestSize.set(CHEST_SIZE_DEFAULT);

    emissiveSkin.set(EMISSIVE_DEFAULT);
    emissivePalette.set(undefined);

    dataVersion.set(DATA_VERSION_DEFAULT);

    capeImage.set(undefined);
    locatorBarIcon.set(LOCATOR_BAR_ICON_DEFAULT);
    locatorBarIconShape.set(LOCATOR_BAR_ICON_SHAPE_DEFAULT);
    locatorBarIconColour.set(LOCATOR_BAR_ICON_COLOUR_DEFAULT);
    locatorBarCustomImage.set(undefined);
    locatorBarImage.set(undefined);
    alfalfaData.set(undefined);
    applyTemplate.set(true);
}
