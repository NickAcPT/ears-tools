<script lang="ts">
    import { EarsAnchor, EarsMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { manipulatorWizardPageTitle, earsAnchor, earsMode, } from "$lib/stores";

    $manipulatorWizardPageTitle = "Ears";
</script>

<div class="flex flex-col gap-4">
    <div>
        <h2 class="text-xl">Anchor</h2>
        <ManipulatorEnumPicker elements={EarsAnchor} kind="ears-anchor" value={earsAnchor} class="px-10 py-4" />
    </div>
    
    <div>
        <h2 class="text-xl">Mode</h2>
        <ManipulatorEnumPicker elements={EarsMode} kind="ears-mode" value={earsMode} class="py-4" preview />
    </div>
</div>
