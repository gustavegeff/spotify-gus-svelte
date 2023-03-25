<script lang="ts">
    import type { SpotifyCurrentlyPlaying } from '$lib/interfaces/spotify-currently-playing';
    import type { SpotifyPlaylist } from '$lib/interfaces/spotify-playlist';
    import { Icon } from '@steeze-ui/svelte-icon';

    import type { SpotifyService } from '$lib/spotify-service';
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import CurrentlyPlaying from './CurrentlyPlaying.svelte';
    import { PlayCircle, QueueList } from '@steeze-ui/heroicons';
    import type { SpotifyQueue } from '$lib/interfaces/spotify-queue';
    import TrackList from './TrackList.svelte';
    import type { AudioFeatures } from '$lib/interfaces/spotify-audio-features';
    import TrackAudioFeatures from './TrackAudioFeatures.svelte';

    export let spotifyService: SpotifyService;

    let currentlyPlayingItem: SpotifyCurrentlyPlaying | null = null;
    let currentPlaylist: SpotifyPlaylist | null = null;
    let currentQueue: SpotifyQueue | null;
    let trackFeatures: AudioFeatures | null = null;

    let progress = 0;
    let selectedMenu = 0;

    let interval: number | null = null;
    let refresh_timeout: number | null = null;
    let poll_interval: number | null = null;

    function refreshCurrentlyPlayingItem() {
        if (refresh_timeout) clearTimeout(refresh_timeout);
        refresh_timeout = null;

        spotifyService.getCurrentlyPlayingTrack().then((current) => {
            if (current) {
                progress = current.progress_ms;

                if (current.context && current.context.type === 'playlist') {
                    // Get the playlist data
                    if (current.context.uri !== currentPlaylist?.uri)
                        spotifyService
                            .getPlaylist(current.context.uri.split(':').pop()!)
                            .then((p) => (currentPlaylist = p));
                } else {
                    currentPlaylist = null;
                    selectedMenu = 0;
                }

                if (interval) clearInterval(interval);
                interval = null;

                if (current.is_playing) {
                    // Start ticking
                    interval = setInterval(() => (progress += 1000), 1000);
                    const time_left = current.item.duration_ms - current.progress_ms;
                    refresh_timeout = setTimeout(refreshCurrentlyPlayingItem, time_left);
                }

                if (current.item.id !== currentlyPlayingItem?.item.id) {
                    spotifyService.getUsersQueue().then((q) => (currentQueue = q));
                    spotifyService.getTrackAudioFeatures(current.item.id).then((af) => (trackFeatures = af));
                }
            } else {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }

            currentlyPlayingItem = current;
        });
    }

    onDestroy(() => {
        if (interval) clearInterval(interval);
        if (poll_interval) clearInterval(poll_interval);
    });

    onMount(() => {
        poll_interval = setInterval(refreshCurrentlyPlayingItem, 10000);
        refreshCurrentlyPlayingItem();
    });
</script>

{#if currentlyPlayingItem !== null}
    <div in:fade out:fade class="flex h-full w-auto items-center justify-center gap-x-8 px-4">
        {#if trackFeatures !== null}
            <div class="fixed top-4">
                <TrackAudioFeatures {trackFeatures} />
            </div>
        {/if}
        <CurrentlyPlaying
            bind:currentlyPlayingItem
            onPrev={() => spotifyService.skipToPrevious().then(() => setTimeout(refreshCurrentlyPlayingItem, 100))}
            onNext={() => spotifyService.skipToNext().then(() => setTimeout(refreshCurrentlyPlayingItem, 100))}
            onPause={() =>
                spotifyService.pausePlayback().then(() => {
                    if (interval) clearInterval(interval);
                    if (refresh_timeout) clearTimeout(refresh_timeout);

                    interval = null;
                    refresh_timeout = null;
                })}
            onPlay={(time_left) =>
                spotifyService.startResumePlayback().then(() => {
                    interval = setInterval(() => (progress += 1000), 1000);
                    refresh_timeout = setTimeout(refreshCurrentlyPlayingItem, time_left);
                })}
            {progress}
        />
        {#if currentPlaylist || currentQueue}
            <div in:fade class="fixed left-0 top-0 flex max-w-md bg-stone-800 text-sm md:h-full md:w-full">
                <div class="menus flex flex-col">
                    <button on:click={() => (selectedMenu = 0)} class:selected={selectedMenu === 0}>
                        <Icon src={QueueList} class="h-4 w-4" />
                    </button>
                    {#if currentPlaylist}
                        <button on:click={() => (selectedMenu = 1)} class:selected={selectedMenu === 1}>
                            <Icon src={PlayCircle} class="h-4 w-4" />
                        </button>
                    {/if}
                </div>
                {#if selectedMenu === 0 && currentQueue}
                    <div class="hidden w-full flex-col overflow-x-hidden md:flex">
                        <h2>Queue</h2>
                        <TrackList
                            currentlyPlayingItemId={currentlyPlayingItem.item.id}
                            tracks={[currentQueue.currently_playing, ...currentQueue.queue]}
                        />
                    </div>
                {:else if selectedMenu === 1 && currentPlaylist}
                    <div class="hidden w-full flex-col overflow-x-hidden md:flex">
                        <h2>Current playlist: {currentPlaylist.name}</h2>
                        <TrackList
                            currentlyPlayingItemId={currentlyPlayingItem.item.id}
                            tracks={currentPlaylist.tracks.items.map((i) => i.track)}
                        />
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{:else}
    <span>Nothing is playing.</span>
{/if}

<style lang="postcss">
    button {
        @apply flex h-12 w-12 items-center justify-center bg-stone-600;
    }

    h2 {
        @apply border-b border-stone-500 px-1 text-xl;
    }

    button.selected {
        @apply bg-green-400;
    }
</style>
