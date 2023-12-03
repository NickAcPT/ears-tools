import type { SvelteComponent } from "svelte";

interface Tool {
    icon: typeof SvelteComponent;
    name: string;
    description?: string[];
    url?: string;
    ghost?: boolean;
}
