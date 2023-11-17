import type { SvelteComponent } from "svelte";

interface Tool {
    icon: typeof SvelteComponent;
    name: string;
    description?: string[];
    url?: string;
    ghost?: boolean;
}

interface EarsEraseRegion {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface SkinCanvasCameraSettings {
    rotation: [number, number, number];
    distance: number;
    look_at: [number, number, number];
}

interface SkinCanvasSunSettings {
    direction: [number, number, number];
    renderShading: boolean;
    intensity: number;
}