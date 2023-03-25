<script lang="ts">
    import type { AudioFeatures } from '$lib/interfaces/spotify-audio-features';

    const KEYS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

    export let trackFeatures: AudioFeatures;
</script>

<div class="grid grid-cols-4 gap-x-4 text-xs">
    <div>
        <h2>BPM</h2>
        <span>{Math.round(trackFeatures.tempo)}</span>
    </div>
    <div>
        <h2>Energy</h2>
        <span>{(100 * trackFeatures.energy).toFixed(1)}%</span>
    </div>
    <div>
        <h2>Key</h2>
        <span>{KEYS[trackFeatures.key]}</span>
    </div>
    <div>
        <h2>Danceability</h2>
        <span>{(100 * trackFeatures.danceability).toFixed(1)}%</span>
    </div>
    <div>
        <h2>Acousticness</h2>
        <span>{(100 * trackFeatures.acousticness).toFixed(1)}%</span>
    </div>
    <div>
        <h2>Speechiness</h2>
        <span>{(100 * trackFeatures.speechiness).toFixed(1)}%</span>
    </div>
</div>

<style lang="postcss">
    h2 {
        @apply text-xl text-stone-400;
    }

    span {
        @apply text-stone-100;
    }
</style>
