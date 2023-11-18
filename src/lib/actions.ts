import type { ActionReturn } from "svelte/action";

export function detectResize(node: HTMLElement, handler: () => void): ActionReturn<() => void> {
    const resizeObserver = new ResizeObserver(handler);
    resizeObserver.observe(node);
    
    window.addEventListener("resize", handler);
    
    return {
        destroy() {
            resizeObserver.disconnect();
            window.removeEventListener("resize", handler);
        },
    };
}