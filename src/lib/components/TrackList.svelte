<script lang="ts">
    import type { Track } from '$lib/interfaces/spotify';

    import { Play } from '@steeze-ui/heroicons';
    import { Icon } from '@steeze-ui/svelte-icon';

    export let currentlyPlayingItemId: string;
    export let tracks: Track[];

    function noDuplicates(tracks: Track[]) {
        // Spotify fucks up sometimes and items are in the queue more than once (for example when autoplaying an
        // artist's featured songs). Or more simply the user wants to play something more than once. If this happens,
        // just ignore the next occurrences.
        const ids = new Set();
        return tracks.filter((track) => {
            if (ids.has(track.id)) return false;

            ids.add(track.id);
            return true;
        });
    }
</script>

<ul class="flex max-h-full w-full flex-col overflow-y-scroll">
    {#each noDuplicates(tracks) as track (track.id)}
        {@const isPlaying = track.id === currentlyPlayingItemId}
        <li class:playing={isPlaying} class="flex w-full items-center p-1">
            <img class="rounded-sm" src={track.album.images[2].url} alt={track.album.name} />
            <div class="ml-2 w-full flex-col overflow-x-hidden">
                <h4 class:playing={isPlaying}>{track.name}</h4>
                <p class="w-full overflow-x-hidden text-ellipsis whitespace-nowrap text-xs text-stone-300">
                    {track.artists.map((a) => a.name).join(', ')} - {track.album.name}
                </p>
            </div>
            {#if isPlaying}
                <div class="ml-auto mr-4 text-sm font-bold text-green-600">
                    <Icon src={Play} class="h-4 w-4" />
                </div>
            {/if}
        </li>
    {/each}
</ul>

<style lang="postcss">
    h4.playing {
        @apply font-bold text-green-600;
    }

    li.playing {
        @apply bg-stone-900;
    }
</style>
