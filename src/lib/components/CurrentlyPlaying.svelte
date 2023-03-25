<script lang="ts">
    import { Backward, Forward, Pause, Play } from '@steeze-ui/heroicons';

    import type { SpotifyCurrentlyPlaying } from '$lib/interfaces/spotify-currently-playing';
    import { Icon } from '@steeze-ui/svelte-icon';

    export let currentlyPlayingItem: SpotifyCurrentlyPlaying;

    export let onPrev: () => void;
    export let onNext: () => void;
    export let onPause: () => Promise<void>;
    export let onPlay: (time_left: number) => Promise<void>;
    export let progress: number;

    function msToTime(s: number) {
        return Intl.DateTimeFormat('en-US', { minute: '2-digit', second: '2-digit' }).format(new Date(s));
    }

    $: current_progress = (100 * progress) / currentlyPlayingItem.item.duration_ms;
</script>

<div class="flex flex-col items-center gap-2">
    <img
        class="rounded-lg"
        alt={currentlyPlayingItem.item.album.name}
        src={currentlyPlayingItem.item.album.images[0].url}
    />
    <div class="flex max-w-[640px] flex-col items-center text-center">
        <div class="text-4xl text-gray-100">{currentlyPlayingItem.item.name}</div>
        <div class="text-2xl text-gray-100">
            {currentlyPlayingItem.item.artists.map((a) => a.name).join(', ')}
        </div>
        <div class="text-gray-100">{currentlyPlayingItem.item.album.name}</div>
    </div>
    <div class="relative h-0.5 w-full bg-gray-500">
        <div class="h-full bg-white transition-all" style={`width: ${current_progress}%`} />
    </div>
    <div class="flex w-full justify-between text-xs">
        <span>{msToTime(progress)}</span>
        <span>{msToTime(currentlyPlayingItem.item.duration_ms)}</span>
    </div>
    <div class="flex gap-4">
        <button on:click={onPrev}>
            <Icon src={Backward} class="h-8 w-8 md:h-6 md:w-6" />
        </button>
        <button
            on:click={async () => {
                if (currentlyPlayingItem.is_playing) onPause().then(() => (currentlyPlayingItem.is_playing = false));
                else
                    onPlay(currentlyPlayingItem.item.duration_ms - progress).then(
                        () => (currentlyPlayingItem.is_playing = true)
                    );
            }}
        >
            {#if currentlyPlayingItem.is_playing}
                <Icon src={Pause} class="h-8 w-8 md:h-6 md:w-6" />
            {:else}
                <Icon src={Play} class="h-8 w-8 md:h-6 md:w-6" />
            {/if}
        </button>
        <button on:click={onNext}>
            <Icon src={Forward} class="h-8 w-8 md:h-6 md:w-6" />
        </button>
    </div>
</div>

<style lang="postcss">
    button {
        @apply rounded-full bg-stone-800 p-2 text-stone-300 transition-colors hover:bg-stone-700;
    }
</style>
