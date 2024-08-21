<svelte:options runes />

<script lang="ts">
    import { assets } from "$app/paths";
    import GitHubIcon from "./icons/GitHubIcon.svelte";
</script>

<nav class="sticky flex items-center justify-center flex-col left-0 top-0 border-b bg-background/60 border-text/20 backdrop-blur-2xl backdrop-saturate-150 h-[var(--navbar-height)]">
    <div class="flex w-full items-center justify-between max-w-[95%] lg:max-w-[85%]">
        <div>
            <a class="flex max-w-fit items-center gap-2" href="/">
                <img class="h-max" src="{assets}/favicon.png" alt="NickAc's Minecraft skin face" />
                <h1 class="text-2xl">Ears Tools</h1>
            </a>
        </div>

        <div>
            <a href="https://github.com/NickAcPT/ears-tools" class="text-xl" aria-label="GitHub"><GitHubIcon /></a>
        </div>
    </div>
</nav>
