<script lang="ts">
    import ManipulatorWelcomePage from "../../../components/manipulator/pages/ManipulatorWelcomePage.svelte";
    import ManipulatorEarsPage from "../../../components/manipulator/pages/ManipulatorEarsPage.svelte";
    import ManipulatorSnoutPage from "../../../components/manipulator/pages/ManipulatorSnoutPage.svelte";
    import ManipulatorTailPage from "../../../components/manipulator/pages/ManipulatorTailPage.svelte";
    import ManipulatorProtrusionsClawsPage from "../../../components/manipulator/pages/ManipulatorProtrusionsClawsPage.svelte";
    import ManipulatorProtrusionsHornPage from "../../../components/manipulator/pages/ManipulatorProtrusionsHornPage.svelte";
    import ManipulatorWingsPage from "../../../components/manipulator/pages/ManipulatorWingsPage.svelte";
    import ManipulatorFinalPage from "../../../components/manipulator/pages/ManipulatorFinalPage.svelte";

    import { earsFeatures, lastEarsFeatures, manipulatorSkinFile, manipulatorSkinSlimModel, manipulatorWizardPageTitle, resetManipulatorEarsFeatures } from "$lib/stores";
    import SkinCanvas from "../../../components/SkinCanvas.svelte";
    import { RenderingSupport, renderingSupport } from "$lib/rendering-support";
    import init from "../../../tools/ears-manipulator/ears_manipulator";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";

    import { apply_features } from "../../../tools/ears-manipulator/ears_manipulator";
    import { tick } from "svelte";
    
    let currentPage = 0;
    let manipulatorInitialized = false;

    const pages = [
        ManipulatorWelcomePage,
        ManipulatorEarsPage,
        ManipulatorSnoutPage,
        ManipulatorTailPage,
        ManipulatorProtrusionsClawsPage,
        ManipulatorProtrusionsHornPage,
        ManipulatorWingsPage,
        ManipulatorFinalPage,
    ];

    function nextPage() {
        currentPage = Math.min(currentPage + 1, pages.length - 1);
    }

    function previousPage() {
        currentPage = Math.max(currentPage - 1, 0);
    }

    $: currentPage != undefined && ($manipulatorWizardPageTitle = null);
    $: canvasScale = renderingSupport != undefined && $renderingSupport === RenderingSupport.SoftwareRendering ? 0.2 : 1;
    
    $: manipulatorInitialized != undefined && $earsFeatures !== $lastEarsFeatures && $manipulatorSkinFile && tick().then(updateFeatures);
    
    resetManipulatorEarsFeatures();
    
    async function updateFeatures() {
        if (!$manipulatorSkinFile || !manipulatorInitialized) {
            console.log(!$manipulatorSkinFile, !manipulatorInitialized);
            return;
        }
        
        $lastEarsFeatures = $earsFeatures;
        console.log("Updating features");
        
        const newFile = apply_features(new Uint8Array(await $manipulatorSkinFile.arrayBuffer()), $earsFeatures);
        
        $manipulatorSkinFile = new File([newFile], $manipulatorSkinFile.name, { type: $manipulatorSkinFile.type, lastModified: new Date().getTime() });
    }

    async function initWasm() {
        await init();
        manipulatorInitialized = true;
    }
</script>

<RequiresWasm init={initWasm} />

<div
    class="container flex h-full justify-between gap-5 py-5"
    class:landscape:grid-cols-[1fr_3fr]={currentPage !== 0}
    class:portrait:grid-rows-[1fr_3fr]={currentPage !== 0}
    class:grid={currentPage !== 0}
>
    <div class:hidden={currentPage === 0} class="flex h-full flex-col justify-center gap-4 portrait:order-1">
        <SkinCanvas
            showDevInfo={false}
            showCape={false}
            style="image-rendering: pixelated; aspect-ratio: 512 / 832;"
            class="min-h-0 flex-1 object-contain"
            width={512 * canvasScale}
            height={832 * canvasScale}
            currentRenderingSupport={renderingSupport}
            skin={$manipulatorSkinFile}
            slimArms={$manipulatorSkinSlimModel}
        />
        <label for="manipulator-use-slim-arms" class="flex items-center gap-2">
            <input type="checkbox" id="manipulator-use-slim-arms" bind:checked={$manipulatorSkinSlimModel} />
            <span>Use slim arms for preview</span>
        </label>

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

        <div class="flex justify-end gap-2" class:hidden={!$manipulatorSkinFile}>
            <!-- prettier-ignore -->
            <ol class="flex items-center justify-center gap-1">
                {#each pages as _, i}
                <button class="appearance-none bullet text-3xl h-5 flex items-center" title="Go to page {i + 1}" class:active={currentPage === i} on:click={() => (currentPage = i)}>
                    •
                </button>
                {/each}
            </ol>
            <button on:click={previousPage}>Previous step</button>
            <button on:click={nextPage}>Next step</button>
        </div>
    </div>
</div>

<style lang="postcss">
    .bullet.active {
        @apply text-accent-500;
    }
</style>
