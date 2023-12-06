<script lang="ts">
    import { earsFeatures, manipulatorSkinFile, resetManipulatorEarsFeatures } from "$lib/stores";
    
    let outImageSrc = $manipulatorSkinFile && URL.createObjectURL($manipulatorSkinFile);
    
</script>

<h1>Page 5</h1>

<pre>{JSON.stringify($earsFeatures, null, 4)}</pre>

<!-- prettier-ignore -->
<button on:click={() => {
    resetManipulatorEarsFeatures();
}}>Reset</button>

<img width="64" height="64" src={outImageSrc} alt="Ouput Minecraft skin" class="w-60 aspect-square" style="image-rendering: pixelated;">
