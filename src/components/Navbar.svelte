<script lang="ts">
    import { assets, base } from "$app/paths";
    import GitHubIcon from "./icons/GitHubIcon.svelte";
</script>

<nav class="sticky left-0 top-0 border-b border-text/20 py-4 backdrop-blur-2xl backdrop-saturate-150">
    <div class="flex items-center justify-between  max-w-[95%] lg:max-w-[85%] mx-auto">
        <div>
            <a class="flex max-w-fit items-center gap-2" href="{base}/">
                <img class="h-max" src="{assets}/favicon.png" alt="NickAc's Minecraft skin face" />
                <h1 class="text-2xl">Ears Tools</h1>
            </a>
        </div>

        <div>
            <a href="https://github.com/NickAcPT/ears-tools" class="text-xl" aria-label="GitHub"><GitHubIcon /></a>
        </div>
    </div>
</nav>
