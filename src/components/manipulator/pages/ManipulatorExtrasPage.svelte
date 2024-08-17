<script lang="ts">
    import { emissiveSkin, getEarsFeatures } from "$lib/stores.svelte";
    import DeleteIcon from "../../icons/DeleteIcon.svelte";
    import SkinDropZone from "../../SkinDropZone.svelte";

    async function handleCapeFile(e: CustomEvent<FileList>) {
        let files = e.detail;
        if (files.length !== 1) {
            console.error("Only one file can be uploaded");
            return;
        }

        let file = files[0];
        getEarsFeatures().cape = new Uint8Array(await file.arrayBuffer());
    }

    function rgb_to_hex(rgb: number): string {
        let argb = rgb.toString(16);
        if (argb.length > 6) {
            argb = argb.slice(2);
        }

        console.log("#" + argb.padStart(6, "0"));
        return "#" + argb.padStart(6, "0");
    }

    function handleEmissiveChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }, idx: number): any {
        const palette = getEarsFeatures().emissives.palette;
        if (!palette) {
            return;
        }

        let value = e.currentTarget.value;
        if (value.startsWith("#")) {
            value = value.slice(1);
        }

        let rgb = parseInt(value, 16);

        if (isNaN(rgb)) {
            e.currentTarget.value = rgb_to_hex(palette[idx]);
            return;
        }

        palette[idx] = rgb;
    }

    function deleteEmissive(i: number): any {
        const palette = getEarsFeatures().emissives.palette;
        if (!palette) {
            return;
        }

        palette.splice(i, 1);
        console.log("Pray this works", palette);
    }
</script>

<div>
    <h2 class="text-2xl">Cape</h2>
    <div class="flex h-min gap-2">
        <SkinDropZone on:files={handleCapeFile} offerDemoSkin={false}>
            {#snippet file()}cape texture{/snippet}
        </SkinDropZone>
        {#if getEarsFeatures().cape}
            <div class="flex flex-1 items-start gap-2">
                <!-- prettier-ignore -->
                <img class="h-full pixelated aspect-auto" src={URL.createObjectURL(new Blob([getEarsFeatures().cape!], { type: "image/png" }))} alt="Cape texture" />
                <button class="mt-2" on:click={() => (getEarsFeatures().cape = undefined)}>Remove</button>
            </div>
        {/if}
    </div>
</div>
<div>
    <h2 class="text-2xl">Chest size</h2>
    <label for="chest-size">Chest Size</label>
    <input type="range" id="chest-size" min="0" max="1" step="0.1" value={getEarsFeatures().chestSize} />
</div>

<div>
    <h2 class="text-2xl">Emissive</h2>
    <div class="grid grid-cols-2 items-start gap-2">
        <div class="flex flex-row items-center gap-2">
            <label for="chest-size">Emissive Skin</label>
            <input type="checkbox" id="emissive-skin" bind:checked={$emissiveSkin} />
        </div>
        {#if $emissiveSkin}
            <div>
                <label for="emissive-palette">Pixels:</label>
                <div id="emissive-palette" class="flex flex-row gap-2">
                    <div class="grid grid-cols-2 grid-rows-8 gap-3">
                        {#if getEarsFeatures().emissives.palette === undefined || getEarsFeatures().emissives.palette.length === 0}
                            <em class="self-center">No emissive pixels yet</em>
                        {:else}
                            {#each getEarsFeatures().emissives.palette as pixel, i (i)}
                                <div class="flex h-9 flex-row items-center gap-2">
                                    <input on:change={(e) => handleEmissiveChange(e, i)} type="color" value={rgb_to_hex(pixel)} />
                                    <input
                                        class="w-[8ch]"
                                        on:change={(e) => handleEmissiveChange(e, i)}
                                        type="text"
                                        value={rgb_to_hex(pixel)}
                                    />
                                    <button on:click={() => deleteEmissive(i)}><DeleteIcon class="h-5" /></button>
                                </div>
                            {/each}
                        {/if}
                        {#if getEarsFeatures().emissives.palette === undefined || getEarsFeatures().emissives.palette.length < 16}
                            <button class="h-9" on:click={() => (getEarsFeatures().emissives.palette.push(0))}>Add</button>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
