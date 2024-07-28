<script lang="ts">
    import { dev } from "$app/environment";
    import { earsFeatures, manipulatorSkinFile, resetManipulatorEarsFeatures } from "$lib/stores";
    import saveAs from "file-saver";
    
    $: outImageSrc = $manipulatorSkinFile && URL.createObjectURL($manipulatorSkinFile);
    
    function replacer(key: string, value: any) {
        if (key=="cape" || key == "wings") return undefined;
        else return value;
    }

</script>

<h1>Page 5</h1>

{#if dev}
    <pre>{JSON.stringify($earsFeatures, replacer, 4)}</pre>
    
    <!-- prettier-ignore -->
    <button on:click={() => {
        resetManipulatorEarsFeatures();
    }}>Reset</button>
{/if}

<button on:click={() => {
    const skin = $manipulatorSkinFile;
    if (skin) saveAs(skin, "skin.png");
}}>Download Skin</button>

<img width="64" height="64" src={outImageSrc} alt="Ouput Minecraft skin" class="w-60 aspect-square" style="image-rendering: pixelated;">
