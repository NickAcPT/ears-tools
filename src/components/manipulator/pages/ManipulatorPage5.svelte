<script lang="ts">

    import { earsFeatures, resetManipulatorEarsFeatures } from "$lib/stores";

</script>
<h1>Page 5</h1>

<pre>{JSON.stringify($earsFeatures, null, 4)}</pre>

<button on:click={() => {
    resetManipulatorEarsFeatures();
}}>Reset</button>