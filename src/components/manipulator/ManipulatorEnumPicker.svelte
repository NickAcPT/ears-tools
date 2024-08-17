<svelte:options runes />

<script lang="ts">
    interface ManipulatorEnumPickerProps {
        elements: Record<string, number | string>;
        kind: string;
        value: number | number[];
        class?: string;
        children?: Snippet<[string]>
    }

    import { enumKeys } from "$lib/misc";
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let { elements, kind, value = $bindable(), children, class: clazz }: ManipulatorEnumPickerProps = $props();

    function humanizeEnumKey(key: string) {
        return key.replace(/([A-Z])/g, " $1").trim();
    }
</script>

{#snippet defaultChildren(element: string)}
    {humanizeEnumKey(element)}
{/snippet}

<div class="keys-grid">
    {#each enumKeys(elements) as element}
        <label for="{kind}-{element}" class="flex items-center justify-center">
            {#if typeof value === "number"}
                <input class="peer appearance-none" id="{kind}-{element}" type="radio" value={elements[element]} bind:group={value} />
            {:else}<input class="peer hidden" id="{kind}-{element}" type="checkbox" value={elements[element]} bind:group={value} />
            {/if}
            <!-- prettier-ignore -->
            <span class="cursor-pointer w-fit button peer-checked:!bg-primary-700 dark:peer-checked:!bg-primary-800 peer-checked:!text-text-on-primary-inverse flex-1 flex flex-col justify-center items-center {clazz ?? ""}">
            {@render (children ?? defaultChildren)(humanizeEnumKey(element))}
        </span>
        </label>
    {/each}
</div>

<style lang="postcss">
    :root {
        --keys-grid-size: 145px;
    }

    @media screen("lg") {
        :root {
            --keys-grid-size: 200px;
        }
    }
    @media screen("2xl") {
        :root {
            --keys-grid-size: 250px;
        }
    }

    .keys-grid {
        @apply grid gap-2;
        grid-template-columns: repeat(auto-fill, minmax(var(--keys-grid-size), 1fr));
    }
</style>
