<script lang="ts">
    import { dev } from "$app/environment";
    import { earsFeatures, manipulatorSkinFile, resetManipulatorEarsFeatures } from "$lib/stores";
    import saveAs from "file-saver";
    
    $: outImageSrc = $manipulatorSkinFile && URL.createObjectURL($manipulatorSkinFile);
    
</script>

<h1>Page 5</h1>

{#if dev}
    <pre>{JSON.stringify($earsFeatures, null, 4)}</pre>
{/if}

<!-- prettier-ignore -->
<button on:click={() => {
    resetManipulatorEarsFeatures();
}}>Reset</button>

<button on:click={() => {
    const skin = $manipulatorSkinFile;
    if (skin) saveAs(skin, "skin.png");
}}>Download Skin</button>

<img width="64" height="64" src={outImageSrc} alt="Ouput Minecraft skin" class="w-60 aspect-square" style="image-rendering: pixelated;">
