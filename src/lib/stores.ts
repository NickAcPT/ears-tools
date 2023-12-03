import { writable } from "svelte/store";

export const earsRegionEditorCurrentFile = writable<File | null>(null);