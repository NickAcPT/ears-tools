<script lang="ts">
    export let name: string;
    export let url: string;
    export let description: string | undefined = undefined;
</script>


<a href="/tools/{url}">
<div class="shadow-md p-4 bg-secondary hover:bg-primary hover:shadow-lg hover:text-background">
    <p class="text-left">{name}</p>
    {#if description}
        <p>{description}</p>
    {/if}
</div>
</a>