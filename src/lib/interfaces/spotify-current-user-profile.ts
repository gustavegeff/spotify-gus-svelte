/**
 * Note: This file was generated using https://app.quicktype.io and the data from the spotify API documentation that
 * can be found here: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
 * in the response example section.
 */

import type { Image } from './spotify';

export interface SpotifyUserProfile {
    country: string;
    display_name: string;
    email: string;
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}
