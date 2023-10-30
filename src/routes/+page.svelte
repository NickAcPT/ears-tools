<script lang="ts">
    import NickAc from "../components/homepage/NickAc.svelte";
    import ToolBox from "../components/homepage/ToolBox.svelte";

    const tools: Tool[] = [
        {
            name: "Region Eraser",
            url: "eraser",
            description: "Easily add Ears mod erase regions to your Minecraft skin"
        },
        {
            name: "Blockbench Model Generator",
            url: "bbmodel-generator",
            description: "Generate a Blockbench model from a Minecraft skin, including Ears mod features"
        },
    ];
</script>

<div class="mx-auto flex flex-col p-4 gap-20">
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
