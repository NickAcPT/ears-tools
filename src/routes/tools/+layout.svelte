<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="pb-10">
    <h1 class="text-3xl text-center">{$page.data.title}</h1>
    {#if $page.data.description}
        <h2 class="text-center">{$page.data.description}</h2>
    {/if}
</div>

<noscript>
    <div class="relative left-0 border-y-2 w-full border-gray-400 bg-red-500/10 flex flex-col items-center gap-2 my-5 p-2">
        <p class="text-xl p-2 text-center">It seems like your browser doesn't support JavaScript</p>
        <p>Not supporting JavaScript is okay, but you'll have to enable it if you expect this tool to work.</p>
    </div>
</noscript>

<slot />
