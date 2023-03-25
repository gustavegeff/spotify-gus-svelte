import type { SpotifyUserProfile } from './interfaces/spotify-current-user-profile';
import type { SpotifyCurrentlyPlaying } from './interfaces/spotify-currently-playing';
import type { SpotifyPlaylist } from './interfaces/spotify-playlist';
import type { SpotifyQueue } from './interfaces/spotify-queue';

export type StorageData = {
    token: string;
    expiration: Date | string;
    refresh_token: string;
};

export class SpotifyService {
    private token: string;
    private refresh_token: string;
    private token_expiration: Date;

    constructor(storage_data: StorageData) {
        this.token = storage_data.token;
        this.refresh_token = storage_data.refresh_token;
        this.token_expiration = new Date(storage_data.expiration);
    }

    public async init() {
        if (this.tokenExpired()) await this.refreshToken();
    }

    private tokenExpired() {
        return this.token_expiration.getTime() <= Date.now();
    }

    private async refreshToken() {
        console.log('Refreshing token');

        return fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: this.refresh_token }),
        })
            .then((res) => res.json())
            .then((data) => {
                const storage_data: StorageData = {
                    token: data.access_token,
                    expiration: new Date(Date.now() + data.expires_in * 1000),
                    refresh_token: data.refresh_token || this.refresh_token,
                };

                localStorage.setItem('spotify-refresh-token', JSON.stringify(storage_data));

                this.token = storage_data.token;
                this.token_expiration = storage_data.expiration as Date;
                this.refresh_token = storage_data.refresh_token;
            });
    }

    private async spotifyGetRequest<T>(uri: string): Promise<T> {
        if (this.tokenExpired()) await this.refreshToken();

        return await fetch(`https://api.spotify.com/v1${uri}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            },
        }).then((res) => {
            if (res.status !== 200) {
                console.error(`Spotify API call for ${uri} returned status ${res.status}: ${res.statusText}`);
                return Promise.reject();
            }

            return res.json();
        });
    }

    private async spotifyPutRequest(uri: string): Promise<void> {
        if (this.tokenExpired()) await this.refreshToken();

        return await fetch(`https://api.spotify.com/v1${uri}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            },
        }).then((res) => {
            if (res.status !== 204) {
                console.error(`Spotify API call for ${uri} returned status ${res.status}: ${res.statusText}`);
                return Promise.reject();
            }
        });
    }

    private async spotifyPostRequest(uri: string): Promise<void> {
        if (this.tokenExpired()) await this.refreshToken();

        return await fetch(`https://api.spotify.com/v1${uri}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            },
        }).then((res) => {
            if (res.status !== 204) {
                console.error(`Spotify API call for ${uri} returned status ${res.status}: ${res.statusText}`);
                return Promise.reject();
            }
        });
    }

    /**
     * Returns the currently playing track.
     * Check out https://developer.spotify.com/documentation/web-api/reference/#/operations/get-the-users-currently-playing-track
     * for reference.
     */
    public async getCurrentlyPlayingTrack() {
        return await this.spotifyGetRequest<SpotifyCurrentlyPlaying>('/me/player/currently-playing').catch(
            () => Promise.resolve(null) // Assumes that any failure means no playing item.
        );
    }

    public async getCurrentUserProfile() {
        return await this.spotifyGetRequest<SpotifyUserProfile>('/me');
    }

    public async startResumePlayback() {
        return await this.spotifyPutRequest('/me/player/play');
    }

    public async pausePlayback() {
        return await this.spotifyPutRequest('/me/player/pause');
    }

    public async skipToNext() {
        return await this.spotifyPostRequest('/me/player/next');
    }

    public async skipToPrevious() {
        return await this.spotifyPostRequest('/me/player/previous');
    }

    public async getPlaylist(id: string) {
        return await this.spotifyGetRequest<SpotifyPlaylist>(`/playlists/${id}`);
    }

    public async getUsersQueue() {
        return await this.spotifyGetRequest<SpotifyQueue>('/me/player/queue');
    }
}
