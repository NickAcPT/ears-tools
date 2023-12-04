<script lang="ts">
    const ears = ["None", "Above", "Sides", "Behind", "Around", "Floppy", "Out", "Cross", "Tall", "Tall Cross"];

    let selectedEars = "None";
</script>

<div class="flex h-full flex-col">
    <h1>Page 2</h1>

    <p>Next up, select the Ears mod features that you want your skin to use.</p>
    
    <h2 class="text-xl">Ears</h2>

    <div class="grid grid-cols-3 gap-2">
        {#each ears as ear}
            <button
                class:!bg-red-500={selectedEars == ear}
                on:click={() => {
                    selectedEars = ear;
                }}
                class="flex flex-col items-center justify-center gap-2 p-10"
            >
                <canvas
                    style="background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC');"
                    class="flex-1"
                    id="skin-image"
                    width="64"
                    height="64"
                ></canvas>
                <p>{ear}</p>
            </button>
        {/each}
    </div>
</div>
