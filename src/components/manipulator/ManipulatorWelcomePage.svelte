<script lang="ts">
    import SkinDropZone from "../SkinDropZone.svelte";
    import NickAc from "../homepage/NickAc.svelte";
</script>

<div class="flex flex-col items-center justify-center gap-10 h-full">
    <h1 class="text-3xl">Welcome to <NickAc />'s Ears Manipulator!</h1>
    <div>
        <p>Start by selecting your skin file or a template skin.</p>
        <SkinDropZone />
    </div>
</div>
