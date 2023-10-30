<script lang="ts">
    import { base } from "$app/paths";
    import type { SvelteComponent } from "svelte";

    export let icon: typeof SvelteComponent;
    export let name: string;
    export let url: string;
    export let description: string | undefined = undefined;
</script>

<a href="{base}/tools/{url}">
    <div
        class="shadow-md h-full min-h-[10em] p-4 rounded-lg bg-primary-500 flex flex-col text-background hover:bg-primary-800 hover:shadow-lg"
    >
        <div class="flex flex-col items-center gap-2">
            <svelte:component this={icon} class="h-10" />
            <h2 class="text-left text-xl font-medium pb-1">{name}</h2>
        </div>
        {#if description}
            <p>{description}</p>
        {/if}
    </div>
</a>
