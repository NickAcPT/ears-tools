export interface EarsFeatures {
    ears: EarsSettings;
    protrusions: Set<Protrusions>;
    tail: TailSettings;
    snout: SnoutSettings;
    wings: WingSettings;
}

export interface EarsSettings {
    type: EarsType;
    anchor: EarsAnchor;
}

export interface TailSettings {
    mode: TailMode;
    segments: 1 | 2 | 3 | 4;
    bends: number[];
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

export enum EarsType {
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
    Front,
    Center,
    Back
}

export enum Protrusions {
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