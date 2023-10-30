<svelte:head>
    <noscript>
        <style>
            .requires-js {
                display: none !important;
            }
        </style>
    </noscript>
</svelte:head>

<div class="requires-js" style:display="contents">
    <slot />
</div>

<style>
</style>
