export type AlfalfaPredefinedKey = "END" | "wing" | "erase" | "cape";
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

export class AlfalfaData {
    constructor(public data: Record<AlfalfaKey, AlfalfaEntryData>) {
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