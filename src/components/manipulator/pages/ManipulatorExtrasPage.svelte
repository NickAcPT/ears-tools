<script lang="ts">
    import { LegMode, LocatorBarIcon, LocatorBarIconShape } from "$lib/ears-manipulator";
    import {
        capeImage,
        chestSize,
        emissivePalette,
        emissiveSkin,
        legMode,
        locatorBarCustomImage,
        locatorBarIcon,
        locatorBarIconColour,
        locatorBarIconShape,
        locatorBarImage,
    } from "$lib/stores";
    import { get_locator_sprites, tint_locator_atlas } from "../../../tools/ears-manipulator/ears_manipulator";
    import dotLocatorAtlas from "$lib/assets/locator-bar/default.png";
    import bowTieLocatorAtlas from "$lib/assets/locator-bar/bowtie.png";
    import DeleteIcon from "../../icons/DeleteIcon.svelte";
    import SkinDropZone from "../../SkinDropZone.svelte";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import LocatorBarPreview from "../LocatorBarPreview.svelte";

    async function handleCapeFile(e: CustomEvent<FileList>) {
        let files = e.detail;
        if (files.length !== 1) {
            console.error("Only one file can be uploaded");
            return;
        }

        let file = files[0];
        $capeImage = new Uint8Array(await file.arrayBuffer());
    }

    const locatorAtlasUrls = {
        [LocatorBarIconShape.Dot]: dotLocatorAtlas,
        [LocatorBarIconShape.BowTie]: bowTieLocatorAtlas,
    };
    let locatorAtlases: Partial<Record<LocatorBarIconShape, Uint8Array>> = {};

    Promise.all(
        Object.entries(locatorAtlasUrls).map(async ([shape, url]) => [shape, new Uint8Array(await (await fetch(url)).arrayBuffer())] as const)
    ).then((atlases) => (locatorAtlases = Object.fromEntries(atlases)));

    function updateLocatorBarImage(
        icon: LocatorBarIcon,
        shape: LocatorBarIconShape,
        colour: string,
        customImage: Uint8Array | undefined,
        atlases: Partial<Record<LocatorBarIconShape, Uint8Array>>
    ) {
        if (icon === LocatorBarIcon.CustomColour) {
            const atlas = atlases[shape];
            if (atlas) {
                $locatorBarImage = tint_locator_atlas(atlas, parseInt(colour.slice(1), 16));
            }
        } else if (icon === LocatorBarIcon.CustomImage) {
            $locatorBarImage = customImage;
        } else {
            $locatorBarImage = undefined;
        }
    }

    function readLocatorSprites(image: Uint8Array): Uint8Array[] | undefined {
        try {
            return get_locator_sprites(image);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async function handleLocatorFile(e: CustomEvent<FileList>) {
        let files = e.detail;
        if (files.length !== 1) {
            console.error("Only one file can be uploaded");
            return;
        }

        const image = new Uint8Array(await files[0].arrayBuffer());
        try {
            get_locator_sprites(image);
        } catch (e) {
            alert(e instanceof Error ? e.message : "The locator bar icon file could not be read.");
            return;
        }

        $locatorBarCustomImage = image;
    }

    $: updateLocatorBarImage($locatorBarIcon, $locatorBarIconShape, $locatorBarIconColour, $locatorBarCustomImage, locatorAtlases);
    $: locatorSprites = $locatorBarImage ? readLocatorSprites($locatorBarImage) : undefined;
    let locatorCustomImageUrl: string | undefined;
    $: updateLocatorCustomImageUrl($locatorBarCustomImage);

    function updateLocatorCustomImageUrl(image: Uint8Array | undefined) {
        if (locatorCustomImageUrl) {
            URL.revokeObjectURL(locatorCustomImageUrl);
        }
        locatorCustomImageUrl = image && URL.createObjectURL(new Blob([image], { type: "image/png" }));
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
        if (!$emissivePalette) {
            return;
        }

        let value = e.currentTarget.value;
        if (value.startsWith("#")) {
            value = value.slice(1);
        }

        let rgb = parseInt(value, 16);

        if (isNaN(rgb)) {
            e.currentTarget.value = rgb_to_hex($emissivePalette[idx]);
            return;
        }

        $emissivePalette[idx] = rgb;
    }

    function deleteEmissive(i: number): any {
        if (!$emissivePalette) {
            return;
        }

        let palette = $emissivePalette;
        palette.splice(i, 1);

        $emissivePalette = palette;
    }
</script>

<div>
    <h2 class="text-2xl">Cape</h2>
    <div class="flex h-min gap-2">
        <SkinDropZone on:files={handleCapeFile} offerDemoSkin={false}>
            <svelte:fragment slot="file">cape texture</svelte:fragment>
        </SkinDropZone>
        {#if $capeImage}
            <div class="flex flex-1 items-start gap-2">
                <!-- prettier-ignore -->
                <img class="h-full pixelated aspect-auto" src={URL.createObjectURL(new Blob([$capeImage], { type: "image/png" }))} alt="Cape texture" />
                <button class="mt-2" on:click={() => ($capeImage = undefined)}>Remove</button>
            </div>
        {/if}
    </div>
</div>
<div>
    <h2 class="text-2xl">Locator Bar</h2>
    <p>Changes the icon other players with Ears see for you on their locator bar.</p>
    <ManipulatorEnumPicker elements={LocatorBarIcon} kind="locator-bar-icon" value={locatorBarIcon} class="py-4" />
    {#if $locatorBarIcon === LocatorBarIcon.CustomColour}
        <div class="mt-2 flex flex-col gap-2">
            <ManipulatorEnumPicker elements={LocatorBarIconShape} kind="locator-bar-icon-shape" value={locatorBarIconShape} class="py-2" />
            <label for="locator-bar-icon-colour" class="flex items-center gap-2">
                Colour
                <input type="color" id="locator-bar-icon-colour" bind:value={$locatorBarIconColour} />
            </label>
        </div>
    {:else if $locatorBarIcon === LocatorBarIcon.CustomImage}
        <div class="mt-2 flex h-min gap-2">
            <SkinDropZone on:files={handleLocatorFile} offerDemoSkin={false} acceptPageInput={false}>
                <svelte:fragment slot="file">16x12 locator bar icon</svelte:fragment>
            </SkinDropZone>
            {#if locatorCustomImageUrl}
                <div class="flex flex-1 items-start gap-2">
                    <img class="h-full pixelated aspect-auto" src={locatorCustomImageUrl} alt="Locator bar icon texture" />
                    <button class="mt-2" on:click={() => ($locatorBarCustomImage = undefined)}>Remove</button>
                </div>
            {/if}
        </div>
        <p class="mt-2">
            Start from a template:
            <a class="underline" href={dotLocatorAtlas} download="locator-bar-dot.png">Dot</a> or
            <a class="underline" href={bowTieLocatorAtlas} download="locator-bar-bow-tie.png">Bow Tie</a>.
        </p>
    {/if}
    {#if $locatorBarIcon !== LocatorBarIcon.MinecraftDefault && locatorSprites}
        <div class="mt-4 flex justify-center">
            <LocatorBarPreview sprites={locatorSprites} />
        </div>
    {/if}
</div>
<div>
    <h2 class="text-2xl">Chest size</h2>
    <label for="chest-size">Chest Size</label>
    <input type="range" id="chest-size" min="0" max="1" step="0.1" bind:value={$chestSize} />
</div>

<div>
    <h2 class="text-2xl">Legs</h2>
    <ManipulatorEnumPicker elements={LegMode} kind="leg-mode" value={legMode} class="py-4" />
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
                        {#if $emissivePalette === undefined || $emissivePalette.length === 0}
                            <em class="self-center">No emissive pixels yet</em>
                        {:else}
                            {#each $emissivePalette as pixel, i (i)}
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
                        {#if $emissivePalette === undefined || $emissivePalette.length < 16}
                            <button class="h-9" on:click={() => ($emissivePalette = [...($emissivePalette || []), 0])}>Add</button>
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
