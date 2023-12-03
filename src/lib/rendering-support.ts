import { writable } from "svelte/store";

export enum RenderingSupport {
    WebGPU,
    WebGL,
    SoftwareRendering
}

export const renderingSupport = writable(RenderingSupport.WebGPU);

export function fallbackToNext(): void {
    renderingSupport.update((current) => {
        switch (current) {
            case RenderingSupport.WebGPU:
                return RenderingSupport.WebGL;
            case RenderingSupport.WebGL:
                return RenderingSupport.SoftwareRendering;
            default:
                return current;
        }
    });
}