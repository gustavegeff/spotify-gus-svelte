import { CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_CLIENT_ID } from '$env/static/public';

type TokenResponse = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
};

type RefreshTokenResponse = {
    access_token: string;
    expires_in: number;
};

export class SpotifyAuthorization {
    private static async getToken<T>(body: string): Promise<T> {
        return fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${PUBLIC_CLIENT_ID}:${CLIENT_SECRET}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            body,
        }).then((res) => {
            if (res.status !== 200) {
                return Promise.reject(`Authorization error: code ${res.status}`);
            }

            return res.json();
        });
    }

    public static refreshToken(refresh_token: string) {
        let body = `grant_type=refresh_token`;
        body += `&refresh_token=${refresh_token}`;

        return this.getToken<RefreshTokenResponse>(body);
    }

    public static getTokenFromCode(redirect_uri: string, code: string) {
        let body = `grant_type=authorization_code`;
        body += `&code=${code}`;
        body += `&redirect_uri=${redirect_uri}/authorize-callback`;

        return this.getToken<TokenResponse>(body);
    }
}
