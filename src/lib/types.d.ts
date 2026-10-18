import type { SvelteComponent } from "svelte";

interface Tool {
    icon: any;
    name: string;
    description?: string[];
    url?: string;
    ghost?: boolean;
    wip?: boolean;
    span?: number;
}