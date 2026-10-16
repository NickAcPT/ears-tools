<script lang="ts">
    import { FeatureStatus, HeadProtrusion } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { claws, headProtrusion, manipulatorWizardPageTitle } from "$lib/stores";

    $manipulatorWizardPageTitle = "Protrusions";
</script>

<div>
    <h2 class="text-2xl">Claws</h2>
    <ManipulatorEnumPicker elements={FeatureStatus} kind="protrusion-claws" value={claws} class="py-5" preview />
</div>

<div>
    <h2 class="text-2xl">Head adornment</h2>
    <ManipulatorEnumPicker elements={HeadProtrusion} kind="protrusion-head" value={headProtrusion} class="py-5" preview />
</div>
