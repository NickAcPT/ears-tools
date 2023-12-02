/* eslint-disable @typescript-eslint/no-unused-vars */
import { browser } from "$app/environment";
import { derived, writable } from "svelte/store";

export enum RenderingSupport {
    WebGPU,
    WebGL,
    SoftwareRendering
}

// place files you want to import through the `$lib` alias in this folder.
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