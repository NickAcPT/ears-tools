<script lang="ts">
    import { AlfalfaData, type AlfalfaEntry, type AlfalfaEntryData, type AlfalfaKey } from "$lib/alfalfa-inspector";
    import saveAs from "file-saver";
    import PlusIcon from "../../../components/icons/PlusIcon.svelte";
    import AlfalfaEntryRow from "../../../components/alfalfa/AlfalfaEntryRow.svelte";
    import init, { read_alfalfa_data, write_alfalfa_data } from "../../../tools/alfalfa-inspector/alfalfa_inspector";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";
    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import { earsRegionEditorCurrentFile } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { createLazyPromise } from "$lib/misc";

    let data: AlfalfaData = new AlfalfaData({});

    let currentSkin: File | null = null;

    let newEntryKey: AlfalfaKey = "";
    let newEntryValue: string = "";
    
    let loadPromise = createLazyPromise<null>();

    function addNewEntry() {
        if (newEntryKey === "") {
            alert("Please enter a key");
            return;
        }
        
        {
            for (let i = 0; i < newEntryKey.length; i++) {
                let c = newEntryKey[i];
                if (c < "@" && i === 0) {
                    alert("Invalid alfalfa entry name - must start with a letter");
                    return;
                }
                if (c > "\u{7F}") {
                    alert("Invalid alfalfa entry name - must be ASCII");
                    return;
                }
            }
        }

        if (newEntryValue === "") {
            alert("Please enter a value");
            return;
        }
        data.set(newEntryKey, { type: "binary", value: new TextEncoder().encode(newEntryValue) });
        notifyDataChange();

        newEntryKey = "";
        newEntryValue = "";
    }

    function downloadEntryData(e: CustomEvent<AlfalfaEntry>) {
        let entry = e.detail;

        if (entry.value.type !== "binary") {
            throw new Error("Cannot download non-binary data");
        }

        saveAs(new Blob([entry.value.value]), entry.key + ".bin");
    }

    function deleteEntry(e: CustomEvent<AlfalfaEntry>): any {
        let entry = e.detail;

        if (entry.key == "cape" || entry.key == "wings") {
            if (
                !confirm(
                    `Are you sure you want to delete the ${entry.key}?\n\nThis will delete the cape from the alfalfa data, but it will not remove the cape from the encoded Ears data in the skin.`
                )
            ) {
                return;
            }
        }

        data.delete(entry.key);
        notifyDataChange();
    }

    function uploadEntryData(e: CustomEvent<AlfalfaEntry>) {
        let entry = e.detail;

        if (entry.value.type === "erase") {
            throw new Error("Cannot upload non-binary data");
        }

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.addEventListener("change", () => {
            if (fileInput.files === null) {
                return;
            }

            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                if (reader.result === null) {
                    return;
                }

                entry.value.value = new Uint8Array(reader.result as ArrayBuffer);
                notifyDataChange();
            });
            reader.readAsArrayBuffer(file);
        });
        fileInput.click();
    }

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }
        await init();
        loadPromise.resolve(null);
    }

    async function notifyDataChange() {
        // Update our skin file
        if (currentSkin) {
            try {
                let skinData = new Uint8Array(await currentSkin.arrayBuffer());
                let fileData = write_alfalfa_data(skinData, data.data);

                currentSkin = new File([fileData], currentSkin.name, { type: currentSkin.type });
            } catch (error) {
                console.error("Failed to update skin file", error);
            }
        }
    }

    async function handleFiles(e: CustomEvent<FileList>) {
        await loadPromise;
        
        let files = e.detail;

        if (files.length !== 1) {
            alert("Please only drop one file");
            return;
        }

        let file = files[0];

        currentSkin = file;
    }

    async function updateAlfalfaDataFromFile(file: File) {
        let fileData = new Uint8Array(await file.arrayBuffer());

        let alfalfaData = <Record<AlfalfaKey, AlfalfaEntryData>>read_alfalfa_data(fileData);

        data = new AlfalfaData(alfalfaData);
    }

    function downloadCurrentSkin() {
        if (currentSkin) {
            saveAs(currentSkin);
        }
    }

    function closeCurrentFile() {
        currentSkin = null;
        data = new AlfalfaData({});
    }

    function openInEraserTool(e: CustomEvent<AlfalfaEntry>) {
        $earsRegionEditorCurrentFile = currentSkin;
        goto("/tools/region-eraser");
    }

    $: currentSkin && updateAlfalfaDataFromFile(currentSkin);
</script>

<RequiresWasm init={initWasm} />

<div class="container flex flex-col gap-2">
    <div class="flex items-center justify-center">
        {#if currentSkin}
            <div class="flex flex-col gap-2">
                <p class="text-center">Currently inspecting file &quot;{currentSkin.name}&quot;.</p>

                <div class="flex gap-2">
                    <button on:click={downloadCurrentSkin}>Download edited file</button>
                    <button on:click={closeCurrentFile}>Close current file</button>
                </div>
            </div>
        {:else}
            <SkinDropZone on:files={handleFiles} />
        {/if}
    </div>

    {#if currentSkin}
        <div class="grid grid-rows-[auto] gap-2">
            {#each data.entries() as entry (entry.key)}
                <AlfalfaEntryRow
                    {entry}
                    on:download={downloadEntryData}
                    on:upload={uploadEntryData}
                    on:delete={deleteEntry}
                    on:eraser-tool={openInEraserTool}
                />
            {/each}

            <div class="grid grid-cols-3 gap-2">
                <input type="text" bind:value={newEntryKey} />
                <input type="text" bind:value={newEntryValue} />
                <button class="flex flex-1 justify-center" on:click={addNewEntry}><PlusIcon class="h-5" /></button>
            </div>
        </div>
    {/if}
</div>

<style lang="postcss">
</style>
