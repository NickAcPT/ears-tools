<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import DropZone from "./DropZone.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import demoSkin from "$lib/assets/demo-skin.png";
    import { page } from "$app/stores";
    import { browser, dev } from "$app/environment";

    let dispatch = createEventDispatcher<{
        files: FileList,
        offerDemoSkin: {replace: (skin: BlobPart) => void}
    }>();

    let pickerHovered = writable<boolean>(false);
    let filePicker: HTMLInputElement;
    export let slimArms: Writable<boolean> | undefined = undefined;
    export let offerDemoSkin: boolean = true;

    function pickFile() {
        filePicker.click();
    }

    function handleInput() {
        if (filePicker.files && filePicker.files.length > 0) {
            dispatch("files", filePicker.files);
        }
    }

    export async function selectDemoSkin() {
        if (!offerDemoSkin) return;
        if ($page.url.searchParams.has("base64")) return;

        let blobPart = undefined;

        const cancelled = dispatch(
            "offerDemoSkin",
            {
                replace: (skin: BlobPart) => {
                    blobPart = skin;
                },
            },
            {
                cancelable: true,
            }
        );

        if (cancelled) {
            let skin = await fetch(demoSkin);
            let data = await skin.arrayBuffer();
            blobPart = data;
        }
        
        if (!blobPart) {
            if (dev) {
                console.log("No blobPart set for demo skin!");
            }
            return;
        }

        let list = new DataTransfer();
        let file = new File([blobPart], "demo-skin.png", { type: "image/png" });
        list.items.add(file);

        if (slimArms) {
            $slimArms = true;
        }
        dispatch("files", list.files);
    }

    $: pickerBgClass = $pickerHovered ? "bg-secondary-200" : "bg-secondary-50";

    // Workaround: Load skin from page URL
    onMount(async () => {
        if (browser) {
            const base64File = $page.url.searchParams.get("base64")?.replace(/-/g, "+")?.replace(/_/g, "/");
            const slimArmsFromUrl = $page.url.searchParams.has("slim");
            if (base64File) {
                function typedArrayToBuffer(array: Uint8Array): BlobPart {
                    //@ts-expect-error idk
                    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
                }

                try {
                    const data = atob(base64File);
                    // Decode the string to a Uint8Array
                    const uint8Array = new Uint8Array(data.length);
                    for (let i = 0; i < data.length; i++) {
                        uint8Array[i] = data.charCodeAt(i);
                    }
                    // "Upload" the file
                    const list = new DataTransfer();
                    const file = new File([typedArrayToBuffer(uint8Array)], "skin.png", { type: "image/png" });
                    list.items.add(file);
                    if (slimArms) {
                        $slimArms = slimArmsFromUrl;
                    }

                    dispatch("files", list.files);
                } catch (e) {
                    alert("Failed to load skin from URL. Are you sure that you encoded the skin correctly (base64url)?");
                    console.error("Failed to load skin from URL", e);
                }
            }
        }
    });
</script>

<DropZone hovered={pickerHovered} on:files>
    <div
        class="flex h-fit w-full max-w-2xl flex-col justify-around gap-5 rounded-2xl border-2 border-dashed border-accent-500 p-10 {pickerBgClass} items-center"
    >
        <p>Drop your <slot name="file">skin</slot> file here or paste it in this page.</p>
        <hr class="m-0 w-full" />
        <div class="text-center">
            <p class="inline">Or alternatively,</p>
            {#if offerDemoSkin}
                <p class="inline">you can try a</p>
                <button class="link" on:click={selectDemoSkin}>demo skin</button>
                <p class="inline">or</p>
            {/if}
            <button on:click={pickFile}>Pick a file instead</button>
            <p class="inline">.</p>
        </div>
        <input class="hidden" type="file" name="file" bind:this={filePicker} on:change={handleInput} />
    </div>
</DropZone>
