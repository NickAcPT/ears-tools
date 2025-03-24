export interface SkinCanvasCameraSettings {
    rotation: [number, number, number];
    distance: number;
    look_at: [number, number, number];
}

export interface SkinCanvasSunSettings {
    direction: [number, number, number];
    renderShading: boolean;
    intensity?: number;
    ambient?: number;
}

export interface SkinCanvasMovementSettings {
    limb_swing: number;
    body_yaw: number;
}