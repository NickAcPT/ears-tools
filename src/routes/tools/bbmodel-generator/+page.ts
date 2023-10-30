import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        title: "Blockbench Model Generator",
    };
}) satisfies PageLoad;