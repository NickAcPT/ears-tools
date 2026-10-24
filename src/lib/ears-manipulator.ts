export enum TextureSource {
    SampleSkin,
    YourSkin,
}

export interface EarsFeatures {
    ears: EarsSettings;
    protrusions: Protrusion[];
    protrusionsSource: TextureSource;
    tail: TailSettings;
    snout?: SnoutSettings;
    wings: WingSettings;
    cape?: Uint8Array;
    locator?: Uint8Array;
    legMode: LegMode;
    chestSize: number;
    alfalfa?: AlfalfaData;
    emissives: EmissiveData;
    dataVersion: number;
    applyTemplate: boolean;
}

export interface EmissiveData {
    enabled: boolean;
    palette: number[];
}

export interface AlfalfaData {
    version: number;
    data: Record<string, Uint8Array>;
}

export interface EarsSettings {
    mode: EarsMode;
    anchor: EarsAnchor;
    source: TextureSource;
}

export interface TailSettings {
    mode: TailMode;
    segments: 1 | 2 | 3 | 4;
    bends: number[];
    animate: boolean;
    swap_jacket_back: boolean;
    source: TextureSource;
}

export enum FeatureStatus {
    Disabled,
    Enabled,
}

export interface SnoutSettings {
    width: number;
    height: number;
    length: number;
    offset: number;
    source: TextureSource;
}

export interface WingSettings {
    mode: WingsMode;
    animations: WingsAnimations;
    wings?: Uint8Array;
    source: TextureSource;
}

export enum EarsMode {
    None,
    Above,
    Sides,
    Behind,
    Around,
    Floppy,
    Out,
    Cross,
    Tall,
    TallCross,
}

export enum EarsAnchor {
    Center,
    Front,
    Back
}

export enum Protrusion {
    Claws,
    Horns,
    Halo,
    DoubleHalo,
}

export enum LegMode {
    Plantigrade,
    DigitigradePartial,
    DigitigradeFull,
}

export enum HeadProtrusion {
    None,
    Horns,
    Halo,
    DoubleHalo,
}

export function headProtrusionToProtrusion(headProtrusion: HeadProtrusion): Protrusion | undefined {
    switch (headProtrusion) {
        case HeadProtrusion.Horns:
            return Protrusion.Horns;
        case HeadProtrusion.Halo:
            return Protrusion.Halo;
        case HeadProtrusion.DoubleHalo:
            return Protrusion.DoubleHalo;
        case HeadProtrusion.None:
            return undefined;
    }
}

export enum TailMode {
    None,
    Down,
    Back,
    Up,
    Vertical,
    Cross,
    CrossOverlap,
    Star,
    StarOverlap,
}

export enum WingsMode {
    None,
    SymmetricDual,
    SymmetricSingle,
    AsymmetricSingleLeft,
    AsymmetricSingleRight,
    AsymmetricDual,
    Flat,
}

export enum WingsAnimations {
    Normal,
    None,
    NoFlight,
    FlightOnly,
}

export enum LocatorBarIcon {
    MinecraftDefault,
    CustomColour,
    CustomImage,
}

export enum LocatorBarIconShape {
    Dot,
    BowTie,
}
