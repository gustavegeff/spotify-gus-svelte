<script lang="ts">
    import Player from '$lib/components/Player.svelte';
    import { SpotifyService } from '$lib/spotify-service';

    import { onMount } from 'svelte';
    import { SpotifyUriBuilder } from '../lib/spotify-uris';

    let spotifyService: SpotifyService = null!;

    onMount(async () => {
        const hasToken = localStorage.getItem('spotify-refresh-token') !== null;

        if (!hasToken) {
            // Check https://github.com/microsoft/TypeScript/issues/48949 for details
            const win: Window = window;
            win.location = SpotifyUriBuilder.buildSpotifyUrl();
            return;
        }

        const service = new SpotifyService(JSON.parse(localStorage.getItem('spotify-refresh-token')!));
        await service.init();

        spotifyService = service;
    });
</script>

<div class="h-screen w-screen bg-stone-900 text-stone-100">
    {#if spotifyService === null}
        <div>Loading...</div>
    {:else}
        {#await spotifyService.getCurrentUserProfile() then profile}
            <div class="fixed top-0 right-0 p-4 leading-none">Hello {profile.display_name}</div>
        {/await}
        <div class="flex h-full w-full items-center justify-center">
            <Player {spotifyService} />
        </div>
    {/if}
</div>
