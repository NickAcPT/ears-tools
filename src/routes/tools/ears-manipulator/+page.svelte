<script lang="ts">
    import ManipulatorPage2 from "../../../components/manipulator/ManipulatorPage2.svelte";
    import ManipulatorPage3 from "../../../components/manipulator/ManipulatorPage3.svelte";
    import ManipulatorPage4 from "../../../components/manipulator/ManipulatorPage4.svelte";
    import ManipulatorWelcomePage from "../../../components/manipulator/ManipulatorWelcomePage.svelte";

    let currentPage = 0;

    const pages = [ManipulatorWelcomePage, ManipulatorPage2, ManipulatorPage3, ManipulatorPage4];

    function nextPage() {
        currentPage = Math.min(currentPage + 1, pages.length - 1);
    }

    function previousPage() {
        currentPage = Math.max(currentPage - 1, 0);
    }
</script>

<div class="container flex h-full flex-col gap-2 py-5">
    <div class="flex-1 bg-gray-800">
        <svelte:component this={pages[currentPage]} />
    </div>

    <div class="flex justify-end gap-2">
        <button on:click={previousPage}>Previous page</button>
        <button on:click={nextPage}>Next page</button>
    </div>
</div>
