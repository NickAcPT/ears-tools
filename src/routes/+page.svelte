<script lang="ts">
    import type { Tool } from "$lib/types";
    import NickAc from "../components/homepage/NickAc.svelte";
    import ToolBox from "../components/homepage/ToolBox.svelte";
    import CubeScanIcon from "../components/icons/CubeScanIcon.svelte";
    import EraserIcon from "../components/icons/EraserIcon.svelte";

    const tools: Tool[] = [
        {
            // @ts-ignore I don't know how to type this lol
            icon: EraserIcon,
            name: "Ears Region Eraser",
            url: "region-eraser",
            description: "Easily add Ears mod erase regions to your Minecraft skin."
        },
        {
            // @ts-ignore I don't know how to type this lol
            icon: CubeScanIcon,
            name: "Blockbench Model Generator",
            url: "bbmodel-generator",
            description: "Generate a Blockbench model from a Minecraft skin, including Ears mod features."
        },
    ];
</script>

<div class="mx-auto flex flex-col p-4 gap-20 container">
    <div class="text-center text-xl">
        <h1 class="text-3xl">Welcome to Ears Tools</h1>
        <p class="inline">Created by</p>
        <NickAc />
        <p class="inline">with 💖</p>
    </div>

    <div class="flex flex-col gap-5">
        <h2 class="text-2xl text-center">Tools</h2>
        {#if tools.length === 0}
            <p class="text-center w-full">No tools exist yet..</p>
        {:else}
            <div class="grid justify-items-stretch gap-4 grid-cols-1 md:grid-cols-2">
                {#each tools as tool}
                    <ToolBox {...tool} />
                {/each}
            </div>
        {/if}
    </div>
</div>
