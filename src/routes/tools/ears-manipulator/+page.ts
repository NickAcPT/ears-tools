import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        title: "Ears Manipulator",
        description: "Get started with the Ears mod by adding Ears features to your own skin.",
        ogdescription: "Create your own Ears-compatible skin following a step-by-step wizard.",
        noDescription: true,
    };
}) satisfies PageLoad;