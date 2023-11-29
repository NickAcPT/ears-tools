<script lang="ts">
    import { base } from "$app/paths";
    import type { Tool } from "$lib/types";
    import NickAc from "../components/homepage/NickAc.svelte";
    import ToolBox from "../components/homepage/ToolBox.svelte";
    import CubeScanIcon from "../components/icons/CubeScanIcon.svelte";
    import EraserIcon from "../components/icons/EraserIcon.svelte";
    import PlusIcon from "../components/icons/PlusIcon.svelte";

    const tools: Tool[] = [
        {
            // @ts-ignore I don't know how to type this lol
            icon: EraserIcon,
            name: "Ears Region Eraser",
            url: "region-eraser",
            description: ["Easily add Ears mod erase regions to your Minecraft skin."],
        },
        {
            // @ts-ignore I don't know how to type this lol
            icon: CubeScanIcon,
            name: "Blockbench Model Generator",
            url: "bbmodel-generator",
            description: ["Generate a Blockbench model from a Minecraft skin, including Ears mod features."],
        },
        {
            // @ts-ignore I don't know how to type this lol
            icon: PlusIcon,
            name: "Your tool idea here..",
            description: ["Got a useful tool idea that could help with using the Ears mod?", "Contact @nickac on Discord."],
            ghost: true,
        },
    ];
</script>

<div class="container mx-auto flex flex-col gap-5 p-4">
    <div class="text-center text-xl">
        <h1 class="text-3xl">Welcome to Ears Tools</h1>
        <p class="inline">Created by</p>
        <NickAc />
        <p class="inline">with 💖</p>
    </div>

    <div class="flex flex-col gap-5">
        <h2 class="text-center text-2xl">Tools</h2>
        {#if tools.length === 0}
            <p class="w-full text-center">No tools exist yet..</p>
        {:else}
            <div class="grid grid-cols-1 3xl justify-items-stretch gap-4 md:grid-cols-2">
                {#each tools as tool}
                    {#if tool.url}
                        <a href="{base}/tools/{tool.url}">
                            <ToolBox {...tool} />
                        </a>
                    {:else}
                        <ToolBox {...tool} />
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>
