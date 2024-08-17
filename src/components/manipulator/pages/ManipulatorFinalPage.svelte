<svelte:options runes />

<script lang="ts">
    import { dev } from "$app/environment";
    import { dataVersion, getEarsFeatures as earsFeatures, manipulatorSkinFile, resetManipulatorEarsFeatures } from "$lib/stores.svelte";
    import saveAs from "file-saver";
    
    let outImageSrc = $derived($manipulatorSkinFile && URL.createObjectURL($manipulatorSkinFile))
    
    function replacer(key: string, value: any) {
        if (key=="cape" || key == "wings") return undefined;
        else return value;
    }

</script>

<h1>Page 5</h1>

{#if dev}
    <pre>{JSON.stringify($state.snapshot(earsFeatures), replacer, 4)}</pre>
    
    <!-- prettier-ignore -->
    <button on:click={() => {
        resetManipulatorEarsFeatures();
    }}>Reset</button>
{/if}

<button on:click={() => {
    const skin = $manipulatorSkinFile;
    if (skin) saveAs(skin, "skin.png");
}}>Download Skin</button>


{#if dev}
    <div>
        <label for="manipulator-data-version">Manipulator data version</label>
        <select id="manipulator-data-version" bind:value={$dataVersion}>
            <option value={0}>V0</option>
            <option value={1}>V1</option>
        </select>
    </div>
{/if}

<img width="64" height="64" src={outImageSrc} alt="Ouput Minecraft skin" class="w-60 aspect-square" style="image-rendering: pixelated;">
