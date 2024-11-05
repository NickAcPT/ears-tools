<svelte:options runes />

<script lang="ts">
    import { FeatureStatus, type SnoutSettings } from "$lib/ears-manipulator";
    import ManipulatorEnumPicker from "../ManipulatorEnumPicker.svelte";
    import { manipulatorWizardPageTitle, getEarsFeatures, DEFAULT_SNOUT_SETTINGS } from "$lib/stores.svelte";
    import { toStore, type Writable } from "svelte/store";

    $manipulatorWizardPageTitle = "Snout";

    let snoutBackup = $state(DEFAULT_SNOUT_SETTINGS);

    let snout = {
        get current() {
            return getEarsFeatures().snout != undefined ? FeatureStatus.Enabled : FeatureStatus.Disabled;
        },
        set current(value) {
            if (value === FeatureStatus.Enabled) {
                getEarsFeatures().snout = snoutBackup;
            } else {
                if (getEarsFeatures().snout != undefined) {
                    snoutBackup = getEarsFeatures().snout!;
                }
                
                getEarsFeatures().snout = undefined;
            }
        }
    };
    
    let hasSnout = $derived(getEarsFeatures().snout != undefined);
    
    let snoutWidth = snoutStore(() => snoutBackup.width, (snout) => snout.width, (snout, value) => snout.width = value);
    let snoutHeight = snoutStore(() => snoutBackup.height, (snout) => snout.height, (snout, value) => snout.height = value);
    let snoutOffset = snoutStore(() => snoutBackup.offset, (snout) => snout.offset, (snout, value) => {
        if (value > (8 - snout.height)) {
            value = (8 - snout.height);
        }    
        snout.offset = value;
    });
    let snoutLength = snoutStore(() => snoutBackup.length, (snout) => snout.length, (snout, value) => snout.length = value);

    function snoutStore<T>(def: () => T, get_fn: (snout: SnoutSettings) => T, set_fn: (snout: SnoutSettings, value: T) => void): Writable<T> {
        return toStore(
            () => {
                const snoutSettings = getEarsFeatures().snout;
                if (snoutSettings != undefined) {
                    return get_fn(snoutSettings);
                }
                
                return def();
            },
            (value) => {
                const snoutSettings = getEarsFeatures().snout;
                if (snoutSettings != undefined) {
                    return set_fn(snoutSettings, value);
                }
            }
        );
    }
    
</script>

<div>
    <ManipulatorEnumPicker elements={FeatureStatus} kind="snout-mode" bind:value={snout.current} class="px-10 py-5">
        {#snippet children(element)}
            <canvas class="flex-1" width="96" height="96"></canvas>
            {element}
        {/snippet}
    </ManipulatorEnumPicker>
</div>

<div class="grid grid-cols-2 justify-items-center">
    <div>
        <label for="snout-width">Width</label>
        <input disabled={!hasSnout} type="range" id="snout-width" min="1" max="7" step="1" bind:value={$snoutWidth} />
    </div>
    <div>
        <label for="snout-height">Height</label>
        <input disabled={!hasSnout} type="range" id="snout-height" min="1" max="4" step="1" bind:value={$snoutHeight} />
    </div>
    <div>
        <label for="snout-offset">Offset</label>
        <input disabled={!hasSnout} type="range" id="snout-offset" min="0" max={8-$snoutHeight} step="1" bind:value={$snoutOffset} />
    </div>
    <div>
        <label for="snout-length">Length</label>
        <input disabled={!hasSnout} type="range" id="snout-length" min="1" max="6" step="1" bind:value={$snoutLength} />
    </div>
</div>

<style lang="postcss">
    canvas {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
