<svelte:options runes />

<script lang="ts">
    import ManipulatorWelcomePage from "../../../components/manipulator/pages/ManipulatorWelcomePage.svelte";
    import ManipulatorEarsPage from "../../../components/manipulator/pages/ManipulatorEarsPage.svelte";
    import ManipulatorSnoutPage from "../../../components/manipulator/pages/ManipulatorSnoutPage.svelte";
    import ManipulatorTailPage from "../../../components/manipulator/pages/ManipulatorTailPage.svelte";
    import ManipulatorProtrusionsPage from "../../../components/manipulator/pages/ManipulatorProtrusionsPage.svelte";
    import ManipulatorWingsPage from "../../../components/manipulator/pages/ManipulatorWingsPage.svelte";
    import ManipulatorFinalPage from "../../../components/manipulator/pages/ManipulatorFinalPage.svelte";

    import {
        currentEarsFeatures,
        emissiveSkin,
        getEarsFeatures,
        lastEarsFeatures,
        manipulatorShowCape,
        manipulatorSkinFile,
        manipulatorSkinSlimModel,
        manipulatorWizardPageTitle,
        resetManipulatorEarsFeatures,
        setEarsFeatures,
        stateSnapshotReactive,
    } from "$lib/stores.svelte";

    import SkinCanvas from "../../../components/SkinCanvas.svelte";
    import type { SkinCanvasSunSettings } from "$lib/skin-canvas";
    import { RenderingSupport, renderingSupport } from "$lib/rendering-support";
    import init, { get_ears_features } from "../../../tools/ears-manipulator/ears_manipulator";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";

    import { apply_features } from "../../../tools/ears-manipulator/ears_manipulator";
    import { untrack } from "svelte";
    import { browser } from "$app/environment";
    import ManipulatorExtrasPage from "../../../components/manipulator/pages/ManipulatorExtrasPage.svelte";
    import { writable } from "svelte/store";
    import type { ManipulatorPageProps } from "../../../components/manipulator/pages/props";

    let currentPage = $state(0);
    let manipulatorInitialized = $state(false);

    const pages: (ManipulatorPageProps|any) = [
        ManipulatorWelcomePage,
        ManipulatorEarsPage,
        ManipulatorSnoutPage,
        ManipulatorTailPage,
        ManipulatorProtrusionsPage,
        ManipulatorWingsPage,
        ManipulatorExtrasPage,
        ManipulatorFinalPage,
    ];

    function nextPage() {
        currentPage = Math.min(currentPage + 1, pages.length - 1);
    }

    function previousPage() {
        currentPage = Math.max(currentPage - 1, 0);
    }

    let canvasScale = $derived(renderingSupport != undefined && $renderingSupport == RenderingSupport.SoftwareRendering ? 0.75 : 1);

    $effect.pre(() => {
        if (currentPage != undefined) {
            $manipulatorWizardPageTitle = null;
            $manipulatorShowCape = true;
        }
    });

    $effect(() => {
        if (
            manipulatorInitialized &&
            stateSnapshotReactive(getEarsFeatures()) /* && $state.snapshot(getEarsFeatures()) !== $lastEarsFeatures */
        ) {
            updateFeatures();
        }
    });

    resetManipulatorEarsFeatures(true);

    let lightsOut = writable(false);

    let sun: SkinCanvasSunSettings = $derived({
        direction: [0.0, 1.0, 1.0],
        renderShading: true,
        intensity: $emissiveSkin && $lightsOut ? 0.0 : undefined,
        ambient: $emissiveSkin && $lightsOut ? 0.0 : undefined,
    });
    
    async function updateFeatures() {
        await Promise.resolve();

        if (!$manipulatorSkinFile || !manipulatorInitialized) {
            console.log(!$manipulatorSkinFile, !manipulatorInitialized);
            return;
        }

        const features = stateSnapshotReactive(getEarsFeatures());

        console.log("Updating features", features);

        try {
            const newFile = apply_features(new Uint8Array(await $manipulatorSkinFile.arrayBuffer()), features);

            untrack(() => {
                const previousFile = $manipulatorSkinFile;
                if (!previousFile) {
                    return;
                }

                $manipulatorSkinFile = new File([newFile], previousFile.name, {
                    type: previousFile.type,
                    lastModified: new Date().getTime(),
                });
            });
        } catch (e) {
            const features = await get_ears_features(new Uint8Array(await $manipulatorSkinFile.arrayBuffer()));
            untrack(() => setEarsFeatures(features));

            if (e instanceof Error) {
                if (e.message.includes("Cannot write more than 1428 bytes of data")) {
                    alert("The cape/wings file you uploaded is too large.\nPlease upload a smaller file.");
                } else {
                    alert(
                        "An error occurred while attempting to apply the features to the skin.\nPlease fix the error (check browser console) and try again."
                    );
                }
            }

            console.error(e);
        }
    }

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }
        await init();
        manipulatorInitialized = true;
    }
</script>

<RequiresWasm init={initWasm} />

<div
    class="container h-full justify-between gap-5 py-5 portrait:!flex portrait:flex-col"
    class:landscape:grid-cols-[1fr_3fr]={currentPage !== 0}
    class:portrait:grid-rows-[1fr_3fr]={currentPage !== 0}
    class:grid={currentPage !== 0}
>
    <div class:hidden={currentPage == 0} class="flex h-full flex-col justify-center gap-4 portrait:order-1">
        <SkinCanvas
            showDevInfo={false}
            showCape={$manipulatorShowCape}
            style="image-rendering: pixelated; aspect-ratio: 512 / 832;"
            class="min-h-0 flex-1 object-contain"
            width={512 * canvasScale}
            height={832 * canvasScale}
            currentRenderingSupport={renderingSupport}
            skin={$manipulatorSkinFile}
            slimArms={$manipulatorSkinSlimModel}
            {sun}
        />
        <label for="manipulator-use-slim-arms" class="flex items-center gap-2">
            <span>Use slim arms for preview</span>
            <input type="checkbox" id="manipulator-use-slim-arms" bind:checked={$manipulatorSkinSlimModel} />
        </label>

        {#if $emissiveSkin}
            <label for="manipulator-lights-out" class="flex items-center gap-2">
                <span>
                    Lights out! <em>(To test emissive skins)</em>
                </span>
                <input type="checkbox" id="manipulator-lights-out" bind:checked={$lightsOut} />
            </label>
        {/if}

        {#if $renderingSupport == RenderingSupport.SoftwareRendering}
            <div class="min-w-none break-words">
                <p>Warning: Software rendering enabled for the skin preview.</p>
                <p>Performance might suffer.</p>
            </div>
        {/if}
    </div>

    <div class="flex flex-1 flex-col gap-2">
        <div class="flex-1">
            <h1 class="text-2xl">{$manipulatorWizardPageTitle ?? ""}</h1>
            <div class="manipulator-page contents">
                {#if pages[currentPage]}
                    {@const CurrentPageComponent = pages[currentPage]}
                    <CurrentPageComponent onnext={() => currentPage++}></CurrentPageComponent>
                {/if}
            </div>
        </div>

        <div class="flex justify-end gap-2" class:hidden={!$manipulatorSkinFile || currentPage == 0}>
            <!-- prettier-ignore -->
            <ol class="flex items-center justify-center gap-1">
                {#each pages as _, i}
                <button aria-labelledby="page_{i+1}_description" id="page_{i+1}" class="appearance-none bullet text-3xl h-5 flex items-center" title="Go to page {i + 1}" class:active={currentPage == i} onclick={() => (currentPage = i)}>
                    •
                </button>
                <span id="page_{i+1}_description" class="sr-only">Page {i + 1} - {currentPage == i ? "Current page" : "Go to page"}</span>
                {/each}
            </ol>
            <button disabled={currentPage == 0} onclick={previousPage}>Previous step</button>
            <button disabled={currentPage == pages.length - 1} onclick={nextPage}>Next step</button>
        </div>
    </div>
</div>

<style lang="postcss">
    .bullet.active {
        @apply text-accent-500;
    }
</style>
