<script lang="ts">
    import ManipulatorWelcomePage from "../../../components/manipulator/pages/ManipulatorWelcomePage.svelte";
    import ManipulatorEarsPage from "../../../components/manipulator/pages/ManipulatorEarsPage.svelte";
    import ManipulatorSnoutPage from "../../../components/manipulator/pages/ManipulatorSnoutPage.svelte";
    import ManipulatorTailPage from "../../../components/manipulator/pages/ManipulatorTailPage.svelte";
    import ManipulatorProtrusionsPage from "../../../components/manipulator/pages/ManipulatorProtrusionsPage.svelte";
    import ManipulatorWingsPage from "../../../components/manipulator/pages/ManipulatorWingsPage.svelte";
    import ManipulatorFinalPage from "../../../components/manipulator/pages/ManipulatorFinalPage.svelte";

    import {
        applyTemplate,
        earsFeatures,
        emissiveSkin,
        lastEarsFeatures,
        manipulatorShowCape,
        manipulatorOutSkinFile,
        manipulatorPreviews,
        manipulatorPreviewSource,
        originalManipulatorSkinFile,
        manipulatorSkinIsGeneratedTemplate,
        manipulatorSkinSlimModel,
        manipulatorWizardPageTitle,
        resetManipulatorEarsFeatures,
        setEarsFeatures,
        snoutHeight,
        snoutLength,
        snoutOffset,
        snoutSource,
        snoutWidth,
        wingsImage,
    } from "$lib/stores";
    import {
        changedPreviewKinds,
        generateManipulatorPreviews,
        revokeManipulatorPreviews,
        type ManipulatorPreviewSource,
    } from "$lib/manipulator-previews";
    import type { SnoutSettings } from "$lib/ears-manipulator";

    import SkinCanvas from "../../../components/SkinCanvas.svelte";
    import type { SkinCanvasSunSettings } from "$lib/skin-canvas";
    import { RenderingSupport, renderingSupport } from "$lib/rendering-support";
    import init, { get_ears_features, get_template_skin } from "../../../tools/ears-manipulator/ears_manipulator";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";

    import { apply_features } from "../../../tools/ears-manipulator/ears_manipulator";
    import { onDestroy, tick } from "svelte";
    import { browser } from "$app/environment";
    import ManipulatorExtrasPage from "../../../components/manipulator/pages/ManipulatorExtrasPage.svelte";
    import { writable } from "svelte/store";

    let currentPage = 0;
    let manipulatorInitialized = false;

    const pages = [
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

    $: currentPage != undefined && ($manipulatorWizardPageTitle = null);
    $: currentPage != undefined && ($manipulatorShowCape = true);
    $: canvasScale = renderingSupport != undefined && $renderingSupport == RenderingSupport.SoftwareRendering ? 0.75 : 1;

    $: manipulatorInitialized != undefined && $earsFeatures !== $lastEarsFeatures && $originalManipulatorSkinFile && tick().then(() => updateFeatures());

    resetManipulatorEarsFeatures(true);
    
    let lightsOut = writable(false);
    let showLayers = writable(true);
    let showEars = writable(true);

    $: sun = {
        direction: [0.0, 1.0, 1.0],
        renderShading: true,
        intensity: $emissiveSkin && $lightsOut ? 0.0 : null,
        ambient: $emissiveSkin && $lightsOut ? 0.0 : null,
    } as SkinCanvasSunSettings;

    /** Bumped per picker kind whenever its previews are re-rendered, cancelling older renders of them. */
    const previewGenerations: Record<string, number> = {};
    let renderedPreviewSource: ManipulatorPreviewSource | null = null;
    let previewsDestroyed = false;

    // A subscription instead of a reactive statement: sources set from other reactive statements would be missed
    onDestroy(manipulatorPreviewSource.subscribe(regeneratePreviews));
    $: refreshPreviewSource($applyTemplate, $wingsImage);
    $: refreshSnoutPreviews({ width: $snoutWidth, height: $snoutHeight, length: $snoutLength, offset: $snoutOffset, source: $snoutSource });

    async function regeneratePreviews(source: ManipulatorPreviewSource | null) {
        const previous = renderedPreviewSource;
        renderedPreviewSource = source;
        if (!source) {
            for (const kind in previewGenerations) previewGenerations[kind]++;
            revokeManipulatorPreviews($manipulatorPreviews);
            $manipulatorPreviews = {};
            return;
        }

        // Only the pickers affected by what changed get re-rendered
        const kinds = changedPreviewKinds(previous, source);
        const generations = Object.fromEntries(kinds.map((kind) => [kind, (previewGenerations[kind] = (previewGenerations[kind] ?? 0) + 1)]));

        try {
            // The previous previews stay until replaced, so changing a setting doesn't flash placeholders
            await generateManipulatorPreviews(
                source,
                kinds,
                (kind) => previewsDestroyed || generations[kind] !== previewGenerations[kind],
                (kind, previews) => {
                    const replaced = $manipulatorPreviews[kind];
                    $manipulatorPreviews = { ...$manipulatorPreviews, [kind]: previews };
                    if (replaced) revokeManipulatorPreviews({ [kind]: replaced });
                }
            );
        } catch (e) {
            console.error("Unable to generate the manipulator previews", e);
        }
    }

    /**
     * Re-renders the previews when the slim arms, template preview or wings texture changed since they were rendered.
     * Without a wings texture, the previews fall back to a placeholder, see `generateManipulatorPreviews`.
     */
    async function refreshPreviewSource(applyTemplateValue: boolean, wings: Uint8Array | undefined) {
        const source = $manipulatorPreviewSource;
        if (!source || !$originalManipulatorSkinFile) return;
        if (
            source.slimArms === $manipulatorSkinSlimModel &&
            source.features.applyTemplate === applyTemplateValue &&
            source.features.wings.wings === wings
        ) {
            return;
        }

        // Generated template skins are regenerated for the arm model, see `updateFeatures`
        const skin = new Uint8Array(await $originalManipulatorSkinFile.arrayBuffer());
        // A newly loaded skin replaced the source in the meantime
        if ($manipulatorPreviewSource !== source) return;

        $manipulatorPreviewSource = {
            ...source,
            skin,
            slimArms: $manipulatorSkinSlimModel,
            features: { ...source.features, applyTemplate: applyTemplateValue, wings: { ...source.features.wings, wings } },
        };
    }

    /** Re-renders only the snout previews when the snout settings changed since they were rendered. */
    function refreshSnoutPreviews(snout: SnoutSettings) {
        const source = $manipulatorPreviewSource;
        if (!source) return;
        const current = source.snout;
        if (
            current.width === snout.width &&
            current.height === snout.height &&
            current.length === snout.length &&
            current.offset === snout.offset &&
            current.source === snout.source
        ) {
            return;
        }

        $manipulatorPreviewSource = { ...source, snout };
    }

    onDestroy(() => {
        previewsDestroyed = true;
        revokeManipulatorPreviews($manipulatorPreviews);
        $manipulatorPreviews = {};
    });
    
    async function updateFeatures(regenerateTemplateBase = false) {
        if (!$originalManipulatorSkinFile || !manipulatorInitialized) {
            console.log(!$originalManipulatorSkinFile, !manipulatorInitialized);
            return;
        }

        const originalSkinFile = $originalManipulatorSkinFile;
        $lastEarsFeatures = $earsFeatures;
        console.log("Updating features");

        try {
            let baseSkin: Uint8Array;
            if ($manipulatorSkinIsGeneratedTemplate && regenerateTemplateBase) {
                console.log("Regenerating template base skin", {
                    slimArms: $manipulatorSkinSlimModel,
                    features: $earsFeatures,
                });
                baseSkin = get_template_skin($earsFeatures, $manipulatorSkinSlimModel);
                console.log("Regenerated template base skin", {
                    slimArms: $manipulatorSkinSlimModel,
                    byteLength: baseSkin.byteLength,
                });
            } else {
                baseSkin = new Uint8Array(await originalSkinFile.arrayBuffer());
            }

            if ($manipulatorSkinIsGeneratedTemplate && regenerateTemplateBase) {
                $originalManipulatorSkinFile = new File([baseSkin], originalSkinFile.name, {
                    type: originalSkinFile.type,
                    lastModified: new Date().getTime(),
                });
            }

            const newFile = apply_features(
                baseSkin,
                $earsFeatures,
                $manipulatorSkinSlimModel,
            );

            $manipulatorOutSkinFile = new File([newFile], $originalManipulatorSkinFile.name, {
                type: $originalManipulatorSkinFile.type,
                lastModified: new Date().getTime(),
            });
        } catch (e) {
            const features = await get_ears_features(new Uint8Array(await $originalManipulatorSkinFile.arrayBuffer()));
            setEarsFeatures(features);

            if (e instanceof Error) {
                if (e.message.includes("Cannot write more than 1428 bytes of data")) {
                    alert("The cape, wings or locator bar icon file you uploaded is too large.\nPlease upload a smaller file.");
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
        await init({});
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
            skin={$manipulatorOutSkinFile}
            slimArms={$manipulatorSkinSlimModel}
            renderLayers={$showLayers}
            renderEars={$showEars}
            bind:sun
        />
        <label for="manipulator-use-slim-arms" class="flex items-center gap-2">
            <span>Use slim arms for preview</span>
            <input
                type="checkbox"
                id="manipulator-use-slim-arms"
                bind:checked={$manipulatorSkinSlimModel}
                on:change={() => tick().then(() => updateFeatures(true)).then(() => refreshPreviewSource($applyTemplate, $wingsImage))}
            />
        </label>
        <label for="manipulator-show-layers" class="flex items-center gap-2">
            <span>Show layers</span>
            <input type="checkbox" id="manipulator-show-layers" bind:checked={$showLayers} />
        </label>
        <label for="manipulator-show-ears" class="flex items-center gap-2">
            <span>Show ears</span>
            <input type="checkbox" id="manipulator-show-ears" bind:checked={$showEars} />
        </label>
        {#if currentPage !== pages.length - 1}
            <label for="manipulator-preview-template" class="flex items-center gap-2" title="Includes placeholders in the skin to make it easier to visually find the new Ears parts.">
                <span>Show Ears template</span>
                <input type="checkbox" id="manipulator-preview-template" bind:checked={$applyTemplate} />
            </label>
        {/if}

        {#if $emissiveSkin}
            <label for="manipulator-lights-out" class="flex items-center gap-2">
                <span>Lights out! <em>(To test emissive skins)</em></span>
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
                <svelte:component this={pages[currentPage]} on:next={() => currentPage++} />
            </div>
        </div>

        <div class="flex justify-end gap-2" class:hidden={!$manipulatorOutSkinFile || currentPage == 0}>
            <!-- prettier-ignore -->
            <ol class="flex items-center justify-center gap-1">
                {#each pages as _, i}
                <button aria-labelledby="page_{i+1}_description" id="page_{i+1}" class="appearance-none bullet text-3xl h-5 flex items-center" title="Go to page {i + 1}" class:active={currentPage == i} on:click={() => (currentPage = i)}>
                    •
                </button>
                <span id="page_{i+1}_description" class="sr-only">Page {i + 1} - {currentPage == i ? "Current page" : "Go to page"}</span>
                {/each}
            </ol>
            <button disabled={currentPage == 0} on:click={previousPage}>Previous step</button>
            <button disabled={currentPage == pages.length - 1} on:click={nextPage}>Next step</button>
        </div>
    </div>
</div>

<style lang="postcss">
    .bullet.active {
        @apply text-accent-500;
    }
</style>
