<script lang="ts">
    import { writable } from "svelte/store";

    import init, { WasmPlayerModel, generate_blockbench_model } from "../../../tools/bbmodel-generator/bbmodel_generator";
    import { saveAs } from "file-saver";
    import { browser } from "$app/environment";
    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import RequiresJs from "../../../components/RequiresJs.svelte";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";

    const models = Object.entries(WasmPlayerModel).filter((item) => isNaN(Number(item[0])));

    let skinModel = writable<WasmPlayerModel>(WasmPlayerModel.Steve);
    let hasLayers = writable<boolean>(true);

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }
        await init();
    }

    async function handleSkinFile(file: File) {
        let result = generate_blockbench_model(new Uint8Array(await file.arrayBuffer()), $skinModel, $hasLayers);

        try {
            let model = result;
            let blob = new Blob([JSON.stringify(model, replacer)], { type: "application/json" });

            let fileName = file.name.split(".");
            fileName.pop();
            fileName.push("bbmodel");

            saveAs(blob, fileName.join("."));
        } catch (error) {
            alert("An error occurred while generating the model. Please notify @nickac on Discord.");
            console.error(error);
        }
    }

    function handleSkinFiles(event: CustomEvent<FileList>) {
        let files = event.detail;
        for (let i = 0; i < files.length; i++) {
            handleSkinFile(files[i]);
        }
    }

    function replacer(_key: any, value: any) {
        if (value instanceof Map) {
            return Object.fromEntries([...value]);
        } else {
            return value;
        }
    }
</script>

<RequiresWasm init={initWasm} />

<div class="container grid md:grid-cols-2">
    <div class="flex w-full flex-col items-center">
        <h2 class="text-center text-2xl">Settings</h2>
        <div class="flex h-full max-w-fit flex-col justify-evenly gap-y-2">
            <div>
                <label for="skin-model">Skin model:</label>
                <select class="rounded border-2 border-accent-500 bg-secondary-50 px-20 py-2" name="skin-model" bind:value={$skinModel}>
                    {#each models as model (model[1])}
                        <option value={model[1]}>{model[0]}</option>
                    {/each}
                </select>
            </div>
            <div>
                <div class="flex gap-2 items-center">
                    <label for="has-layers">Has layers:</label>
                    <input type="checkbox" name="has-layers" id="has-layers" bind:checked={$hasLayers} />
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col items-center">
        <h2 class="max-w-fit text-center text-2xl">Input</h2>
        <SkinDropZone slimArms={hasLayers} on:files={handleSkinFiles} />
    </div>
</div>
