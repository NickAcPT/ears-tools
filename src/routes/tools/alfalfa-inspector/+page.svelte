<svelte:options runes />

<script lang="ts">
    import { AlfalfaData, type AlfalfaEntry, type AlfalfaEntryData, type AlfalfaKey } from "$lib/alfalfa-inspector.svelte";
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
    import UploadIcon from "../../../components/icons/UploadIcon.svelte";

    let data: AlfalfaData = $state(new AlfalfaData({}));

    let uploadedSkin: File | null = $state(null);

    let newEntry = $state<{
        key: AlfalfaKey;
        value: string;
    }>({
        key: "",
        value: "",
    });

    let loadPromise = createLazyPromise<null>();

    function validateName(name: string): string | null {
        if (name === "") {
            return "Please enter a key";
        }

        {
            for (let i = 0; i < name.length; i++) {
                let c = name[i];
                if (c < "@" && i === 0) {
                    return "Invalid alfalfa entry name - must start with a letter";
                }
                if (c > "\u{7F}") {
                    return "Invalid alfalfa entry name - must be ASCII";
                }
            }
        }

        return null;
    }

    function addNewEntry() {
        const validationResult = validateName(newEntry.key);

        if (validationResult) {
            alert(validationResult);
            return;
        }

        if (newEntry.value === "") {
            alert("Please enter a value");
            return;
        }
        data.set(newEntry.key, { type: "binary", value: new TextEncoder().encode(newEntry.value) });

        newEntry.key = "";
        newEntry.value = "";
    }

    function downloadEntryData(e: CustomEvent<AlfalfaEntry>) {
        let entry = e.detail;
        
        if (entry.value.type === "erase") {
            throw new Error("Cannot download non-binary data");
        }
        
        let extension = "bin";
        if (entry.value.type === "image") {
            extension = "png";
        }

        saveAs(new Blob([entry.value.value]), `${entry.key}.${extension}`);
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
    }

    function uploadEntryData(e: CustomEvent<AlfalfaEntry | null>) {
        let entry = e.detail;

        if (entry?.value.type === "erase") {
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

                const fileData = new Uint8Array(reader.result as ArrayBuffer);
                if (entry === null) {
                    // Uploading a new entry.
                    const result = validateName(newEntry.key);

                    if (result) {
                        alert(result);
                        return;
                    }

                    data.set(newEntry.key, { type: "binary", value: fileData });
                } else {
                    entry.value.value = fileData;
                }
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

    async function makeEditedSkin(data: AlfalfaData): Promise<File | undefined> {
        await Promise.resolve();

        // Update our skin file
        if (uploadedSkin) {
            try {
                let skinData = new Uint8Array(await uploadedSkin.arrayBuffer());
                let fileData = write_alfalfa_data(skinData, $state.snapshot(data.data));

                return new File([fileData], uploadedSkin.name, { type: uploadedSkin.type });
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("Cannot write more than 1428 bytes of data")) {
                        alert("The data you uploaded is too large.\nPlease upload a smaller file.");
                    } else {
                        alert(
                            "An error occurred while attempting to apply the features to the skin.\nPlease fix the error (check browser console) and try again."
                        );
                    }
                }
                console.error("Failed to update skin file", error);

                return undefined;
            }
        }
    }

    async function handleFiles(e: CustomEvent<FileList>) {
        await loadPromise;

        let files = e.detail;

        if (files.length > 1) {
            alert("Please only drop one file. Amount of files dropped: " + files.length);
            return;
        }

        if (files.length === 0) {
            debugger;
            return;
        }

        let file = files[0];

        uploadedSkin = file;
    }

    async function updateAlfalfaDataFromFile(file: File) {
        let fileData = new Uint8Array(await file.arrayBuffer());

        let alfalfaData = read_alfalfa_data(fileData) as Record<AlfalfaKey, AlfalfaEntryData>;

        data = new AlfalfaData(alfalfaData);
    }

    function uploadNewEntry() {
        const validationResult = validateName(newEntry.key);

        if (validationResult) {
            alert(validationResult);
            return;
        }

        uploadEntryData(new CustomEvent("upload", { detail: null }));
    }

    async function downloadCurrentSkin() {
        let out = await editedSkin;

        if (out) {
            saveAs(out);
        }
    }

    function closeCurrentFile() {
        uploadedSkin = null;
        data = new AlfalfaData({});
    }

    function openInEraserTool(e: CustomEvent<AlfalfaEntry>) {
        $earsRegionEditorCurrentFile = uploadedSkin;
        goto("/tools/region-eraser");
    }

    $effect(() => {
        uploadedSkin && updateAlfalfaDataFromFile(uploadedSkin);
    });

    let editedSkin = $derived.by(async () => await makeEditedSkin(data));
</script>

<RequiresWasm init={initWasm} />

<div class="container flex flex-col gap-2">
    <div class="flex items-center justify-center">
        {#if uploadedSkin}
            <div class="flex flex-col gap-2">
                <p class="text-center">Currently inspecting file &quot;{uploadedSkin.name}&quot;.</p>

                <div class="flex gap-2">
                    <button onclick={downloadCurrentSkin}>Download edited file</button>
                    <button onclick={closeCurrentFile}>Close current file</button>
                </div>
            </div>
        {:else}
            <SkinDropZone onfiles={handleFiles} />
        {/if}
    </div>

    {#if uploadedSkin}
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

            <div class="grid grid-cols-[1fr_2fr_1fr] gap-2">
                <input type="text" bind:value={newEntry.key} />
                <div class="grid grid-cols-[3fr_1fr] gap-2">
                    <input type="text" bind:value={newEntry.value} />
                    <button class="flex flex-1 justify-center" onclick={uploadNewEntry}><UploadIcon class="h-5" />Upload</button>
                </div>
                <button class="flex flex-1 justify-center" onclick={addNewEntry}><PlusIcon class="h-5" /></button>
            </div>
        </div>
    {/if}
</div>

<style lang="postcss">
</style>
