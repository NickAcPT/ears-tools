<script lang="ts">
    import { writable, type Readable, type Writable } from "svelte/store";

    import init, { WasmPlayerModel, generate_blockbench_model } from "../../../tools/bbmodel-generator/bbmodel_generator";
    import { saveAs } from "file-saver";
    import { browser } from "$app/environment";
    import SkinDropZone from "../../../components/SkinDropZone.svelte";
    import RequiresWasm from "../../../components/RequiresWasm.svelte";
    import { createLazyPromise } from "$lib/misc";

    const models = Object.entries(WasmPlayerModel).filter((item) => isNaN(Number(item[0])));

    let skinModel = writable<WasmPlayerModel>(WasmPlayerModel.Steve);
    let hasLayers = writable<boolean>(true);

    let loadPromise = createLazyPromise<null>();

    let hasSlimArms: Readable<boolean> & Writable<boolean> = {
        update: (fn) => {
            skinModel.update((value: WasmPlayerModel): WasmPlayerModel => {
                return fn(value === WasmPlayerModel.Alex) ? WasmPlayerModel.Alex : WasmPlayerModel.Steve;
            });
        },
        set: (value) => {
            skinModel.set(value ? WasmPlayerModel.Alex : WasmPlayerModel.Steve);
        },
        subscribe: (callback) => {
            return skinModel.subscribe((value) => {
                callback(value === WasmPlayerModel.Alex);
            });
        },
    };

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }
        await init();
        loadPromise.resolve(null);
    }

    async function handleSkinFile(file: File) {
        await loadPromise;
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
                <div class="flex items-center gap-2">
                    <label for="has-layers">Has layers:</label>
                    <input type="checkbox" name="has-layers" id="has-layers" bind:checked={$hasLayers} />
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col items-center">
        <h2 class="max-w-fit text-center text-2xl">Input</h2>
        <SkinDropZone slimArms={hasSlimArms} on:files={handleSkinFiles} />
    </div>
</div>
