import { SpotifyAuthorization } from '$lib/server/spotify-auth';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async (sl: PageServerLoad) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = new URL((sl as any).request.url);

    if (!url.searchParams.has('code')) throw error(401, 'Authorization failed');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const code = url.searchParams.get('code')!;

    try {
        return await SpotifyAuthorization.getTokenFromCode(url.origin, code);
    } catch (err) {
        console.error(err);
        throw error(500, 'Authorization failed');
    }
};

export const prerender = false;
export const ssr = false;
