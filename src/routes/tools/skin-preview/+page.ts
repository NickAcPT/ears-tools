import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        title: "Skin Preview",
        description: "To preview a Minecraft skin, drag your skin file to the upload region.",
        ogdescription: "Tool to preview Minecraft skins.",
        noDescription: true,
    };
}) satisfies PageLoad;