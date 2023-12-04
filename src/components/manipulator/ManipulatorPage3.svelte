<script lang="ts">
    const protrusions = ["Claws", "Horns"];
    const tails = ["None", "Up", "Back", "Down", "Vertical"];

    let selectedProtrusions: string[] = [];
    let selectedTail = "None";
</script>

<div class="flex h-full flex-col">
    <h1>Page 3</h1>

    <p>Next up, select the Ears mod features that you want your skin to use.</p>

    <div class="grid flex-1 grid-cols-2 gap-4">
        <div class="flex flex-1 flex-col">
            <h2 class="text-xl">Protrusions</h2>
            <div class="grid flex-1 grid-cols-3 gap-2">
                {#each protrusions as protrusion}
                    <button
                        class:!bg-red-500={selectedProtrusions.includes(protrusion)}
                        on:click={() => {
                            if (selectedProtrusions.includes(protrusion)) {
                                selectedProtrusions = selectedProtrusions.filter((p) => p != protrusion);
                            } else {
                                selectedProtrusions.push(protrusion);
                                selectedProtrusions = [...selectedProtrusions];
                            }
                        }}
                        class="flex h-40 flex-col items-center justify-center gap-2 p-10"
                    >
                        <canvas class="flex-1" id="skin-image" width="64" height="64"></canvas>
                        <p>{protrusion}</p>
                    </button>
                {/each}
            </div>
        </div>

        <div class="flex flex-1 flex-col">
            <h2 class="text-xl">Tail</h2>
            <div class="grid grid-cols-3 gap-2">
                {#each tails as tail}
                    <button
                        class:!bg-red-500={selectedTail == tail}
                        on:click={() => {
                            selectedTail = tail;
                        }}
                        class="flex h-40 flex-col items-center justify-center gap-2 p-10"
                    >
                        <canvas class="flex-1" id="skin-image" width="64" height="64"></canvas>
                        <p>{tail}</p>
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
