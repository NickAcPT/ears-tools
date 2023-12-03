<script lang="ts">
    import { AlfalfaData, type AlfalfaEntry, type AlfalfaKey } from "$lib/alfalfa-inspector";
    import { saveAs } from "file-saver";
    import DownloadIcon from "../../../components/icons/DownloadIcon.svelte";
    import UploadIcon from "../../../components/icons/UploadIcon.svelte";
    import DeleteIcon from "../../../components/icons/DeleteIcon.svelte";
    import PlusIcon from "../../../components/icons/PlusIcon.svelte";
    import AlfalfaEntryRow from "../../../components/alfalfa/AlfalfaEntryRow.svelte";

    let data: AlfalfaData = new AlfalfaData(1, {
        test: { type: "binary", value: new TextEncoder().encode("Hello world") },
    });

    let newEntryKey: AlfalfaKey = "";
    let newEntryValue: string = "";

    function addNewEntry() {
        data.set(newEntryKey, { type: "binary", value: new TextEncoder().encode(newEntryValue) });
        notifyDataChange();

        newEntryKey = "";
        newEntryValue = "";
    }

    function notifyDataChange() {
        // Notify svelte that we changed the data
        data = data;
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
        
        data.delete(entry.key);
        notifyDataChange();
    }

    function uploadEntryData(e: CustomEvent<AlfalfaEntry>) {
        let entry = e.detail;
        
        if (entry.value.type !== "binary") {
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
</script>

<div class="container">
    <div class="grid grid-cols-3 grid-rows-[auto] gap-2">
        {#each data.entries() as entry (entry.key)}
            <AlfalfaEntryRow
                entry={entry}
                on:download={downloadEntryData}
                on:upload={uploadEntryData}
                on:delete={deleteEntry}
            />
        {/each}
    
        <div class="contents">
            <input type="text" bind:value={newEntryKey} />
            <input type="text" bind:value={newEntryValue} />
            <button class="flex-1 flex justify-center" on:click={addNewEntry}><PlusIcon class="h-5"/></button>
        </div>
    </div>
</div>

<style lang="postcss">
</style>
