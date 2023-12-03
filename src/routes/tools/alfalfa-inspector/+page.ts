import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        title: "Alfalfa Inspector",
        description: "To inspect Alfalfa data from a Minecraft skin, drag your skin file to the upload region.",
        ogdescription: "Tool to inspect and edit low-level Alfalfa data stored in an Ears skin."
    };
}) satisfies PageLoad;