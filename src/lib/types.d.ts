import type { SvelteComponent } from "svelte";

interface Tool {
    icon: typeof SvelteComponent<unknown>;
    name: string;
    description?: string[];
    url?: string;
    ghost?: boolean;
    wip?: boolean;
}