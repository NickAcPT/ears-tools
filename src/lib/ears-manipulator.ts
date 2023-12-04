export interface EarsFeatures {
    ears: EarsSettings;
    protrusions: Set<Protrusion>;
    tail: TailSettings;
    snout: SnoutSettings;
    wings: WingSettings;
}

export interface EarsSettings {
    mode: EarsMode;
    anchor: EarsAnchor;
}

export interface TailSettings {
    mode: TailMode;
    segments: 1 | 2 | 3 | 4;
    bends: number[];
}

export enum SnoutStatus {
    Disabled,
    Enabled,
}

export interface SnoutSettings {
    width: number;
    height: number;
    length: number;
    offset: number;
}

export interface WingSettings {
    mode: WingsMode;
    animations: WingsAnimations;
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