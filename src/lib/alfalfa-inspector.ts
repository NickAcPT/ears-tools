export type AlfalfaPredefinedKey = "END" | "wing" | "erase" | "cape" | "locator";
export type AlfalfaKey = AlfalfaPredefinedKey | string;

export interface AlfalfaBinaryEntryData {
    type: "binary";
    value: Uint8Array;
}

export interface AlfalfaImageEntryData {
    type: "image";
    value: Uint8Array;
}

export interface AlfalfaEraseEntryData {
    type: "erase";
    value: {
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
}

export type AlfalfaEntryData = AlfalfaBinaryEntryData | AlfalfaImageEntryData | AlfalfaEraseEntryData;

export type AlfalfaEntry = {
    key: AlfalfaKey;
    value: AlfalfaEntryData;
};

// Keys holding PNG data that the wasm reader doesn't know about (it only tags `cape` and `wing` as images).
// Image and binary entries are encoded identically, so this only affects how the entry is presented.
const EXTRA_IMAGE_KEYS: AlfalfaKey[] = ["locator"];

export class AlfalfaData {
    constructor(public data: Record<AlfalfaKey, AlfalfaEntryData>) {
        for (const key of EXTRA_IMAGE_KEYS) {
            const entry = data[key];
            if (entry?.type === "binary") {
                data[key] = { type: "image", value: entry.value };
            }
        }
    }

    get(key: AlfalfaKey): AlfalfaEntryData | undefined {
        return this.data[key];
    }

    set(key: AlfalfaKey, value: AlfalfaEntryData): void {
        this.data[key] = value;
    }

    delete(key: AlfalfaKey): void {
        delete this.data[key];
    }
    
    entries(): AlfalfaEntry[] {
        const values = Object.entries(this.data).map(([key, value]) => ({key, value}));
        values.sort((a, b) => a.key.localeCompare(b.key));
        return values;
    }
    
    cleanup(): void {
        for (const key of Object.keys(this.data)) {
            if (this.data[key].type === "binary" && this.data[key].value.length === 0) {
                delete this.data[key];
            }
        }
    }
}