<script lang="ts">
    export let name: string;
    export let url: string;
    export let description: string | undefined = undefined;
</script>

<a href="/tools/{url}">
    <div class="shadow-md h-full min-h-[10em] p-4 rounded-lg bg-primary-500 flex flex-col text-background hover:bg-primary-800 hover:shadow-lg">
        <h2 class="text-left text-xl font-medium pb-1">{name}</h2>
        {#if description}
            <p>{description}</p>
        {/if}
    </div>
</a>
