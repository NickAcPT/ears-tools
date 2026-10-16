<script lang="ts">
    import { enumKeys } from "$lib/misc";
    import { manipulatorPreviews } from "$lib/stores";
    import type { ManipulatorPreviews } from "$lib/manipulator-previews";
    import type { Writable } from "svelte/store";

    export let elements: Record<string, number | string>;
    export let kind: string;
    /** Shows the rendered preview of each option, see `generateManipulatorPreviews`. */
    export let preview = false;

    export let value: Writable<number | number[]>;

    function humanizeEnumKey(key: string) {
        return key.replace(/([A-Z])/g, " $1").trim();
    }

    function previewUrl(previews: ManipulatorPreviews, element: string) {
        return previews[kind]?.[elements[element] as number];
    }
</script>

<div class="keys-grid">
    {#each enumKeys(elements) as element}
        <label for="{kind}-{element}" class="flex items-center justify-center">
            {#if typeof $value === "number"}
                <input class="peer appearance-none" id="{kind}-{element}" type="radio" value={elements[element]} bind:group={$value} />
            {:else}<input class="peer hidden" id="{kind}-{element}" type="checkbox" value={elements[element]} bind:group={$value} />
            {/if}
            <!-- prettier-ignore -->
            <span class="cursor-pointer w-fit button peer-checked:!bg-primary-700 dark:peer-checked:!bg-primary-800 peer-checked:!text-text-on-primary-inverse flex-1 flex flex-col justify-center items-center {$$restProps["class"] ?? ""}">
            {#if preview}
                {@const url = previewUrl($manipulatorPreviews, element)}
                {#if url}
                    <img class="preview mb-2 aspect-square w-32 max-w-full" src={url} alt="" />
                {:else}
                    <div class="preview mb-2 aspect-square w-32 max-w-full animate-pulse" />
                {/if}
            {/if}
            <slot element={humanizeEnumKey(element)}>
                {humanizeEnumKey(element)}
            </slot>
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

    .preview {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEVmZmaZmZmoZ+Z2AAAAD0lEQVQIW2PkZ4TADxAIABIoBAXF3RsYAAAAAElFTkSuQmCC");
    }
</style>
