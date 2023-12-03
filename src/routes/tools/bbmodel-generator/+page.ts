import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        title: "Blockbench Model Generator",
        description: "To generate a Blockbench model from a Minecraft skin, pick your settings, then drag your skin file to the upload region.",
        ogdescription: "Tool to generate a Blockbench model from a Minecraft skin, including Ears mod features."
    };
}) satisfies PageLoad;