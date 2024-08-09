<svelte:options runes />
<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";

    let { ...rest }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg {...rest} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
</svg>
