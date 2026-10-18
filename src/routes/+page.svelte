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
    import ImageEditIcon from "../components/icons/ImageEditIcon.svelte";

    const tools: Tool[] = [
        {
            icon: ImageEditIcon,
            name: "Ears Manipulator",
            description: [
                "Create your own Ears-compatible skin following a step-by-step wizard.",
            ],
            url: "ears-manipulator",
            span: 2
        },
        {
            icon: MirrorIcon,
            name: "Skin Preview",
            url: "skin-preview",
            description: ["Preview your Minecraft skin, with or without Ears mod features."],
        },
        {
            icon: EraserIcon,
            name: "Ears Region Eraser",
            url: "region-eraser",
            description: ["Easily add Ears mod erase regions to your Minecraft skin."],
        },
        {
            icon: CubeScanIcon,
            name: "Blockbench Model Generator",
            url: "bbmodel-generator",
            description: ["Generate a Blockbench model from a Minecraft skin, including Ears mod features."],
        },
        {
            icon: AlphaMagnifierIcon,
            name: "Alfalfa Inspector",
            description: ["Inspect and Edit low-level Alfalfa data stored in an Ears skin."],
            url: "alfalfa-inspector",
        },
        {
            icon: PlusIcon,
            name: "Your tool idea here..",
            description: ["Got a useful tool idea that could help with using the Ears mod?", "Contact @nickac on Discord."],
            ghost: true,
            span: 2
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
                    {@const span = tool.span ?? 1}
                    {#if tool.url}
                        <a class="block" style="grid-column: span {span} / span {span}" href="{base}/tools/{tool.url}">
                            <ToolBox {...tool} />
                        </a>
                    {:else}
                        <div class="block" style="grid-column: span {span} / span {span}">
                            <ToolBox {...tool} />
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>
