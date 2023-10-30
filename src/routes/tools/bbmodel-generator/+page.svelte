<script lang="ts">
    import { writable } from "svelte/store";

    import init, { WasmPlayerModel, generate_blockbench_model } from "../../../tools/bbmodel-generator/bbmodel-generator_wasm";
    import { saveAs } from "file-saver";
    import { browser } from "$app/environment";
    import SkinDropZone from "../../../components/bbmodel-generator/SkinDropZone.svelte";
    import RequiresJs from "../../../components/RequiresJs.svelte";

    const models = Object.entries(WasmPlayerModel).filter((item) => isNaN(Number(item[0])));

    let skinModel = writable<WasmPlayerModel>(WasmPlayerModel.Steve);
    let pickerHovered = writable<boolean>(false);
    let hasLayers = writable<boolean>(true);

    async function initWasm() {
        if (!browser) {
            return Promise.resolve();
        }
        await init();
    }

    async function handleSkinFile(file: File) {
        let result = generate_blockbench_model(new Uint8Array(await file.arrayBuffer()), $skinModel, $hasLayers);

        let model = result.value();
        let error = result.is_error();

        if (error) {
            alert(model);
            return;
        }

        let blob = new Blob([JSON.stringify(model, replacer)], { type: "application/json" });

        let fileName = file.name.split(".");
        fileName.pop();
        fileName.push("bbmodel");

        saveAs(blob, fileName.join("."));
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

    function handlePaste(e: ClipboardEvent) {
        if (e.clipboardData?.files?.length && e.clipboardData?.files?.length > 0) {
            handleSkinFile(e.clipboardData.files[0]);
        }
    }
</script>

<svelte:window on:paste={handlePaste} />

<RequiresJs>
    {#await initWasm()}
        <p class="text-center">Loading...</p>
    {:catch error}
        <div class="relative left-0 border-y-2 w-full border-gray-400 bg-red-500/10 flex flex-col items-center gap-2 my-5 p-2">
            <p class="text-xl p-2 text-center">It seems like your browser doesn't support WebAssembly</p>
            <p>Please check if you have a recent version of your browser, and if you do, please contact @nickacpt on Discord.</p>
            <p>Error: {error.message}</p>
        </div>
    {/await}
</RequiresJs>

<div class="grid md:grid-cols-2 container">
    <div class="flex flex-col items-center w-full">
        <h2 class="text-2xl text-center">Settings</h2>
        <div class="flex flex-col justify-evenly max-w-fit h-full gap-y-2">
            <div>
                <label for="skin-model">Skin model:</label>
                <select class="border-accent-500 bg-secondary-50 border-2 rounded py-2 px-20" name="skin-model" bind:value={$skinModel}>
                    {#each models as model (model[1])}
                        <option value={model[1]}>{model[0]}</option>
                    {/each}
                </select>
            </div>
            <div>
                <div>
                    <label for="has-layers">Has layers:</label>
                    <input type="checkbox" name="has-layers" id="has-layers" bind:checked={$hasLayers} />
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col items-center">
        <h2 class="text-2xl max-w-fit text-center">Input</h2>
        <SkinDropZone on:files={handleSkinFiles} />
    </div>
</div>
