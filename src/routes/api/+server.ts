import { SpotifyAuthorization } from '$lib/server/spotify-auth';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export async function POST(req: RequestHandler) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (req as any).request.json();

    if (!data || !data.refresh_token) throw error(400, 'Bad request');

    return new Response(JSON.stringify(await SpotifyAuthorization.refreshToken(data.refresh_token)), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
