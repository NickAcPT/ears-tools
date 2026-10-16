<script lang="ts" context="module">
    import barSprite from "$lib/assets/locator-bar/bar.png";

    let barImage: Promise<HTMLImageElement> | undefined;

    function loadBar() {
        barImage ??= new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = barSprite;
        });
        return barImage;
    }
</script>

<script lang="ts">
    export let sprites: Uint8Array[];

    const BAR_WIDTH = 182;
    const BAR_TOP = 2;
    const BAR_BORDER = 5;
    const BAR_TILE = 2;
    const ICON_CENTER_Y = 4;
    const ICON_OFFSETS = [-60, -20, 20, 60];

    let canvas: HTMLCanvasElement;
    let bar: HTMLImageElement | undefined;

    loadBar().then((image) => (bar = image));

    function spriteCanvas(rgba: Uint8Array) {
        const size = Math.sqrt(rgba.length / 4);
        const sprite = document.createElement("canvas");
        sprite.width = size;
        sprite.height = size;
        sprite.getContext("2d")?.putImageData(new ImageData(new Uint8ClampedArray(rgba), size, size), 0, 0);
        return sprite;
    }

    function draw(canvas: HTMLCanvasElement, bar: HTMLImageElement | undefined, sprites: Uint8Array[]) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (bar) {
            ctx.drawImage(bar, 0, 0, BAR_BORDER, bar.height, 0, BAR_TOP, BAR_BORDER, bar.height);
            for (let x = BAR_BORDER; x < BAR_WIDTH - BAR_BORDER; x += BAR_TILE) {
                ctx.drawImage(bar, BAR_BORDER, 0, BAR_TILE, bar.height, x, BAR_TOP, BAR_TILE, bar.height);
            }
            ctx.drawImage(bar, bar.width - BAR_BORDER, 0, BAR_BORDER, bar.height, BAR_WIDTH - BAR_BORDER, BAR_TOP, BAR_BORDER, bar.height);
        }

        sprites.map(spriteCanvas).forEach((icon, i) => {
            const radius = (icon.width - 1) / 2;
            ctx.drawImage(icon, BAR_WIDTH / 2 + ICON_OFFSETS[i] - radius, ICON_CENTER_Y - radius);
        });
    }

    $: canvas && draw(canvas, bar, sprites);
</script>

<canvas bind:this={canvas} width={BAR_WIDTH} height={9} class="w-full max-w-3xl" style="image-rendering: pixelated" />
