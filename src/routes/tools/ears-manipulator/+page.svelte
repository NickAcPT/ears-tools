<script lang="ts">
    import ManipulatorEarsPage from "../../../components/manipulator/pages/ManipulatorEarsPage.svelte";
    import ManipulatorTailAndProtrusionsPage from "../../../components/manipulator/pages/ManipulatorTailAndProtrusionsPage.svelte";
    import ManipulatorSnoutPage from "../../../components/manipulator/pages/ManipulatorSnoutPage.svelte";
    import ManipulatorWelcomePage from "../../../components/manipulator/pages/ManipulatorWelcomePage.svelte";
    import ManipulatorPage5 from "../../../components/manipulator/pages/ManipulatorPage5.svelte";

    let currentPage = 0;

    const pages = [ManipulatorWelcomePage, ManipulatorEarsPage, ManipulatorTailAndProtrusionsPage, ManipulatorSnoutPage, ManipulatorPage5];

    function nextPage() {
        currentPage = Math.min(currentPage + 1, pages.length - 1);
    }

    function previousPage() {
        currentPage = Math.max(currentPage - 1, 0);
    }
</script>

<div class="container flex h-full flex-col gap-2 py-5">
    <div class="flex-1">
        <svelte:component this={pages[currentPage]} />
    </div>

    <div class="flex justify-end gap-2">
        <!-- prettier-ignore -->
        <ol class="flex items-center justify-center gap-1">
            {#each pages as _, i}
                <button class="appearance-none bullet text-3xl h-5 flex items-center" title="Go to page {i + 1}" class:active={currentPage === i} on:click={() => (currentPage = i)}>
                    •
                </button>
            {/each}
        </ol>
        <button on:click={previousPage}>Previous page</button>
        <button on:click={nextPage}>Next page</button>
    </div>
</div>

<style lang="postcss">
    .bullet.active {
        @apply text-accent-500;
    }
</style>
