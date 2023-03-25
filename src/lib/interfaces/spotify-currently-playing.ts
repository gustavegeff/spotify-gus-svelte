/**
 * Note: This file was generated using https://app.quicktype.io and the data from the spotify API documentation that
 * can be found here: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-the-users-currently-playing-track
 * in the response example section.
 */

import type { Track } from './spotify';

export interface SpotifyCurrentlyPlaying {
    device: Device;
    repeat_state: string;
    shuffle_state: boolean;
    context: Context | null;
    timestamp: number;
    progress_ms: number;
    is_playing: boolean;
    item: Track;
    currently_playing_type: string;
    actions: Actions;
}

export interface Actions {
    interrupting_playback: boolean;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
}

export interface Context {
    type: string;
    href: string;
    uri: string;
}

export interface Device {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
}
