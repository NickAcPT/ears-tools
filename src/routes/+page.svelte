<script lang="ts">
    import { base } from "$app/paths";
    import type { Tool } from "$lib/types";
    import NickAc from "../components/homepage/NickAc.svelte";
    import ToolBox from "../components/homepage/ToolBox.svelte";
    import CubeScanIcon from "../components/icons/CubeScanIcon.svelte";
    import EraserIcon from "../components/icons/EraserIcon.svelte";
    import AlphaMagnifierIcon from "../components/icons/AlphaMagnifierIcon.svelte";
    import MirrorIcon from "../components/icons/MirrorIcon.svelte";
    import PlusIcon from "../components/icons/PlusIcon.svelte";
    import FlaskIcon from "../components/icons/FlaskIcon.svelte";

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
            icon: MirrorIcon,
            name: "Skin Preview",
            url: "skin-preview",
            description: ["Preview your Minecraft skin, with or without Ears mod features."],
        },
        {
            // @ts-ignore I don't know how to type this lol
            icon: AlphaMagnifierIcon,
            name: "Alfalfa Inspector",
            description: ["Inspect and Edit low-level Alfalfa data stored in an Ears skin."],
            url: "alfalfa-inspector",
        },
        // @ts-ignore I don't know how to type this lol
        {
            // @ts-ignore I don't know how to type this lol
            icon: FlaskIcon,
            name: "Ears Manipulator",
            description: [
                "Create your own Ears-compatible skin following a step-by-step wizard.",
                "Just like a science experiment, this might go wrong.",
            ],
            url: "ears-manipulator",
            wip: true,
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
            <div class="3xl grid grid-cols-1 justify-items-stretch gap-4 md:grid-cols-2">
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
