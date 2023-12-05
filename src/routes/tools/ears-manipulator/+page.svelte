<script lang="ts">
    import ManipulatorWelcomePage from "../../../components/manipulator/pages/ManipulatorWelcomePage.svelte";
    import ManipulatorEarsPage from "../../../components/manipulator/pages/ManipulatorEarsPage.svelte";
    import ManipulatorSnoutPage from "../../../components/manipulator/pages/ManipulatorSnoutPage.svelte";
    import ManipulatorTailPage from "../../../components/manipulator/pages/ManipulatorTailPage.svelte";
    import ManipulatorProtrusionsPage from "../../../components/manipulator/pages/ManipulatorProtrusionsPage.svelte";
    import ManipulatorWingsPage from "../../../components/manipulator/pages/ManipulatorWingsPage.svelte";
    import ManipulatorFinalPage from "../../../components/manipulator/pages/ManipulatorFinalPage.svelte";

    import { manipulatorSkinFile, manipulatorSkinSlimModel, manipulatorWizardPageTitle, resetManipulatorEarsFeatures } from "$lib/stores";
    import SkinCanvas from "../../../components/SkinCanvas.svelte";
    import { RenderingSupport, renderingSupport } from "$lib/rendering-support";

    let currentPage = 0;

    const pages = [
        ManipulatorWelcomePage,
        ManipulatorEarsPage,
        ManipulatorSnoutPage,
        ManipulatorTailPage,
        ManipulatorProtrusionsPage,
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

    resetManipulatorEarsFeatures();
    $: canvasScale = renderingSupport != undefined && $renderingSupport === RenderingSupport.SoftwareRendering ? 0.2 : 1;
</script>

<div class="container h-full flex justify-between gap-5 py-5"
    class:landscape:grid-cols-[1fr_3fr]={currentPage !== 0}
    class:portrait:grid-rows-[1fr_3fr]={currentPage !== 0}
    class:grid={currentPage !== 0}
>
    <div class:hidden={currentPage === 0} class="flex justify-center h-full flex-col gap-4 portrait:order-1">
        <SkinCanvas
            showDevInfo={false}
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
                <svelte:component this={pages[currentPage]} on:next="{() => currentPage++}" />
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
