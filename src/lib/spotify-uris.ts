import { PUBLIC_CLIENT_ID } from '$env/static/public';

export class SpotifyUriBuilder {
    private static REDIRECT_URI = location.origin + '/authorize-callback';

    // You can checkout the list of available scopes on
    // https://developer.spotify.com/documentation/general/guides/authorization/scopes/
    private static SCOPES =
        'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state ';

    private static client_id = PUBLIC_CLIENT_ID || '';

    private static getRandomString() {
        return (Math.random() + 1).toString(36).substring(2);
    }

    public static buildSpotifyUrl(): string {
        let url = `https://accounts.spotify.com/authorize?`;

        url += `response_type=code`;
        url += `&client_id=${this.client_id}`;
        url += `&scope=${SpotifyUriBuilder.SCOPES}`;
        url += `&redirect_uri=${SpotifyUriBuilder.REDIRECT_URI}`;
        url += `&state=${this.getRandomString()}`;

        return encodeURI(url);
    }
}
