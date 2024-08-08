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
    chestSize: number;
    alfalfa?: AlfalfaData;
    emissives: EmissiveData;
    dataVersion: number;
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
    TallCross
}

export enum EarsAnchor {
    Center,
    Front,
    Back
}

export enum Protrusion {
    Claws,
    Horns
}

export enum TailMode {
    None,
    Down,
    Back,
    Up,
    Vertical
}

export enum WingsMode {
    None,
    SymmetricDual,
    SymmetricSingle,
    AsymmetricSingleLeft,
    AsymmetricSingleRight,
}

export enum WingsAnimations {
    Normal,
    None
}