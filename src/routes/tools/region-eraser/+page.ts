import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        title: "Ears Region Eraser",
        description: "To manage the ears erase regions, drag your skin file to the upload region.",
        ogdescription: "Tool to edit Ears erase regions.",
        noDescription: true,
    };
}) satisfies PageLoad;