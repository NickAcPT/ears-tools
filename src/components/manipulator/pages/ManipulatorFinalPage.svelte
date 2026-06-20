<script lang="ts">
    import { dev } from "$app/environment";
    import { dataVersion, earsFeatures, manipulatorOutSkinFile, resetManipulatorEarsFeatures, applyTemplate } from "$lib/stores";
    import saveAs from "file-saver";
    
    $: outImageSrc = $manipulatorOutSkinFile && URL.createObjectURL($manipulatorOutSkinFile);
    
    function replacer(key: string, value: any) {
        if (value instanceof Uint8Array) return "[binary data]";
        else return value;
    }

</script>
<section class="space-y-6">
    <div class="space-y-2">
        <h1 class="text-3xl font-semibold">Export</h1>
    </div>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,22rem)]">
        <div class="rounded-2xl border border-secondary-500/30 p-4 shadow-sm">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <button on:click={() => {
                    const skin = $manipulatorOutSkinFile;
                    if (skin) saveAs(skin, "skin.png");
                }}>Download Skin</button>
            </div>

            <div class="mt-4 flex justify-center rounded-2xl border border-dashed border-secondary-500/40 p-4">
                <img
                    width="64"
                    height="64"
                    src={outImageSrc}
                    alt="Output Minecraft skin"
                    class="aspect-square w-48 sm:w-60"
                    style="image-rendering: pixelated;"
                />
            </div>
        </div>

        <aside class="space-y-3">
            <details class="rounded-2xl border border-secondary-500/30 p-4 shadow-sm">
                <summary class="cursor-pointer list-none text-lg font-semibold">
                    <span class="flex items-center justify-between gap-4">
                        <span>Advanced options</span>
                        <svg
                            aria-hidden="true"
                            class="advanced-chevron h-5 w-5 shrink-0 text-text/70 transition-transform duration-200"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </summary>

                <div class="mt-4 space-y-4 border-t border-secondary-500/20 pt-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium" for="manipulator-data-version">Manipulator data version</label>
                        <select
                            class="w-full rounded-lg border border-secondary-500/40  px-3 py-2"
                            id="manipulator-data-version"
                            bind:value={$dataVersion}
                        >
                            <option value={0}>V0</option>
                            <option value={1}>V1</option>
                        </select>
                        <div class="rounded-xl p-2 text-sm text-text/80">
                            <p><strong>V0:</strong> Classic "pixelwise" format. Data pixels are human editable.</p>
                            <p class="mt-2"><strong>V1:</strong> Compact newer "binary" format. Data pixels are not human editable.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-3 rounded-xl p-2">
                        <input class="mt-0.5 shrink-0" type="checkbox" id="manipulator-apply-template" bind:checked={$applyTemplate} />
                        <div class="space-y-1">
                            <label class="block text-sm font-medium" for="manipulator-apply-template">Apply template</label>
                        </div>
                    </div>
                </div>
            </details>
        </aside>
    </div>
</section>

{#if dev && false}
    <pre>{JSON.stringify($earsFeatures, replacer, 4)}</pre>
    
    <!-- prettier-ignore -->
    <button on:click={() => {
        resetManipulatorEarsFeatures();
    }}>Reset</button>
{/if}

<style lang="postcss">
    details[open] .advanced-chevron {
        transform: rotate(180deg);
    }
</style>
