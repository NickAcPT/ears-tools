<script lang="ts">
    import { TailMode } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import {
        tailMode,
        tailBends,
        tailSegments,
        tailAnimate,
        tailSwapJacketBack,
        manipulatorWizardPageTitle,
        manipulatorShowCape,
        dataVersion,
    } from "$lib/stores";
    import { countValue } from "$lib/misc";

    $manipulatorWizardPageTitle = "Tail";
    $manipulatorShowCape = false;

    const segmentCountElement = countValue(1, 4);

</script>

<div>
    <h3 class="text-xl">Mode</h3>
    <ManipulatorEnumPicker elements={TailMode} kind="tail-mode" value={tailMode} class="px-10 py-5" preview />
</div>
<div>
    <h3 class="text-xl">Segments</h3>
    <ManipulatorEnumPicker
        elements={segmentCountElement}
        kind="tail-segment-count"
        value={tailSegments}
        class="px-10 py-5"
    ></ManipulatorEnumPicker>
</div>

<div>
    <h3 class="text-xl">Bends</h3>

    <div class="grid grid-cols-2 justify-items-center">
        {#each $tailBends as bend, i}
            <div>
                <label for="tail-bend-{i}">Bend {i + 1}</label>
                <input type="range" id="tail-bend-{i}" min="-90" max="90" step="15" bind:value={bend} disabled={i >= $tailSegments} />
            </div>
        {/each}
    </div>
</div>

<div>
    <h3 class="text-xl">Behavior</h3>
    <div class="flex flex-col gap-2">
        <label for="tail-animate" class="flex items-center gap-2">
            <input type="checkbox" id="tail-animate" bind:checked={$tailAnimate} />
            Animate
        </label>
        <label for="tail-swap-jacket-back" class="flex items-center gap-2">
            <input type="checkbox" id="tail-swap-jacket-back" bind:checked={$tailSwapJacketBack} />
            Swap tail and jacket back
        </label>
    </div>
</div>
