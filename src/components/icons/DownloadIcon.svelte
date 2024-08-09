<svelte:options runes />
<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";

    let { ...rest }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg {...rest} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
</svg>
