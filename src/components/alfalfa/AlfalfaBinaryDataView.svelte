<script lang="ts">
    import type { AlfalfaBinaryEntryData } from "$lib/alfalfa-inspector.svelte";

    export let data: AlfalfaBinaryEntryData;

    $: dataHex = hexString(data.value);
    
    function hexString(buffer: Uint8Array): string {
        function hexSlice(buffer: Uint8Array, start: number, end: number): string {
            let slice = buffer.slice(start, end);
            // hex offset | hex values | ascii values
            
            let hexOffset = start.toString(16).padStart(8, "0");
            
            let hexCodes = [];
            let asciiCodes = [];
            for (let i = 0; i < slice.length; i++) {
                let value = slice[i];
                let stringValue = value.toString(16);
                let paddedValue = stringValue.padStart(2, "0");
                hexCodes.push(paddedValue);
                asciiCodes.push(value >= 32 && value <= 126 ? String.fromCharCode(value) : ".");
            }
            
            let hexValues = hexCodes.join(" ");
            let asciiValues = asciiCodes.join("");
            return `${hexOffset} | ${hexValues.padEnd(16 * 3 - 1, " ")} | ${asciiValues}`;
        }
    
        let hexLines = [];
        for (let i = 0; i < buffer.length; i += 16) {
            hexLines.push(hexSlice(buffer, i, i + 16));
        }
        
        return hexLines.join("\n");
    }
    
</script>

<pre class="whitespace-pre-wrap  bg-gray-500/30 p-1.5">{dataHex}</pre>
