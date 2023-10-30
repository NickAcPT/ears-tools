import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        title: "Ears Region Eraser"
    };
}) satisfies PageLoad;