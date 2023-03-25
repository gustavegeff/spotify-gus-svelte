<script lang="ts">
    import { goto } from '$app/navigation';
    import type { StorageData } from '$lib/spotify-service';

    import type { PageServerData } from './$types';

    export let data: PageServerData;

    const storage_data: StorageData = {
        token: data.access_token,
        expiration: new Date(Date.now() + data.expires_in * 1000),
        refresh_token: data.refresh_token,
    };

    localStorage.setItem('spotify-refresh-token', JSON.stringify(storage_data));

    // Small timeout to make the navigation less blinky
    setTimeout(() => goto('/', { replaceState: true }), 500);
</script>

<div>Successfully authenticated.</div>
