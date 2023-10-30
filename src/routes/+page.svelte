<script lang="ts">
    import Tool from "../components/homepage/Tool.svelte";
</script>

<div class="mx-auto h-screen flex flex-col p-4 gap-20">
    <div class="text-center">
        <h1 class="text-3xl">Welcome to Ears Tools</h1>
        <p class="text-xl">Created by NickAcPT with 💖</p>
    </div>

    <div class="flex flex-col gap-5">
        <h2 class="text-2xl text-center">Tools</h2>
        <div class="grid justify-items-stretch gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Tool name="Test" url="eraser" description="Lorem ipsum dolor amet" />
            <Tool name="Test" url="eraser" description="Lorem ipsum dolor amet" />
            <Tool name="Test" url="eraser" description="Lorem ipsum dolor amet" />
            <Tool name="Test" url="eraser" description="Lorem ipsum dolor amet" />
            <Tool name="Test" url="eraser" description="Lorem ipsum dolor amet" />
        </div>
    </div>
</div>
