<script lang="ts">
    import { enumKeys } from "$lib/misc";
    import type { Writable } from "svelte/store";

    export let elements: Record<string, number | string>;
    export let kind: string;

    export let value: Writable<number | number[]>;
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
    {#each enumKeys(elements) as element}
        <label for="{kind}-{element}" class="flex items-center justify-center">
            {#if typeof $value === "number"}
                <input class="peer appearance-none" id="{kind}-{element}" type="radio" value={elements[element]} bind:group={$value} />
            {:else}<input class="peer hidden" id="{kind}-{element}" type="checkbox" value={elements[element]} bind:group={$value} />
            {/if}
            <!-- prettier-ignore -->
            <span class="cursor-pointer w-fit rounded-xl bg-primary-500 peer-hover:bg-primary-600 peer-checked:!bg-primary-800 text-text-on-primary flex-1 flex flex-col justify-center items-center {$$restProps["class"] ?? ""}">
            <slot {element}>
                {element}
            </slot>
        </span>
        </label>
    {/each}
</div>