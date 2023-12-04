<script lang="ts">
    const ears = ["None", "Above", "Sides", "Behind", "Around", "Floppy", "Out", "Cross", "Tall", "Tall Cross"];
    const anchors = ["Front", "Center", "Back"];

    let selectedAnchor = "Front";
    let selectedEars = "None";
</script>

<div class="flex h-full flex-col">
    <h1>Page 2</h1>

    <p>Next up, select the Ears mod features that you want your skin to use.</p>

    <div class="grid flex-1 grid-cols-2 gap-4">
        <div class="flex flex-1 flex-col">
            <h2 class="text-xl">Ears</h2>
            <div class="grid flex-1 grid-cols-3 gap-2">
                {#each ears as ear}
                    <button
                        class:!bg-red-500={selectedEars == ear}
                        on:click={() => {
                            selectedEars = ear;
                        }}
                        class="flex h-40 flex-col items-center justify-center gap-2 p-10"
                    >
                        <canvas class="flex-1" id="skin-image" width="64" height="64"></canvas>
                        <p>{ear}</p>
                    </button>
                {/each}
            </div>
        </div>

        <div class="flex flex-1 flex-col">
            <h2 class="text-xl">Anchor</h2>
            <div class="grid grid-cols-3 gap-2">
                {#each anchors as anchor}
                    <button
                        class:!bg-red-500={selectedAnchor == anchor}
                        on:click={() => {
                            selectedAnchor = anchor;
                        }}
                        class="flex h-40 flex-col items-center justify-center gap-2 p-10"
                    >
                        <canvas class="flex-1" id="skin-image" width="64" height="64"></canvas>
                        <p>{anchor}</p>
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    canvas {
        image-rendering: pixelated;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
