<script lang="ts">
    import type { AlfalfaBinaryEntryData } from "$lib/alfalfa-inspector";

    export let data: AlfalfaBinaryEntryData;

    // Taken from https://github.com/xem/hex/
    $: dataHex = [...data.value]
        .map((byte, index) => {
            let hex = (0 + byte.toString(16)).slice(-2);
            return index % 16 === 0 ? "\n" + (1e7 + (+index).toString(16)).slice(-8) + " | " + hex : " " + hex;
        })
        .join("").trim();
</script>

<pre class="whitespace-pre-wrap">{dataHex}</pre>
