// Note: This file was generated using https://app.quicktype.io

import type { Track } from './spotify';

export interface SpotifyPlaylist {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: Owner;
    primary_color: null;
    public: boolean;
    snapshot_id: string;
    tracks: Tracks;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href: null;
    total: number;
}

export interface Image {
    height: number | null;
    url: string;
    width: number | null;
}

export interface Owner {
    display_name?: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: OwnerType;
    uri: string;
    name?: string;
}

export enum OwnerType {
    Artist = 'artist',
    User = 'user',
}

export interface Tracks {
    href: string;
    items: Item[];
    limit: number;
    next: null;
    offset: number;
    previous: null;
    total: number;
}

export interface Item {
    added_at: Date;
    added_by: Owner;
    is_local: boolean;
    primary_color: null;
    track: Track;
    video_thumbnail: VideoThumbnail;
}

export interface Album {
    album_group: AlbumGroup;
    album_type: AlbumGroup;
    artists: Owner[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    is_playable: boolean;
    name: string;
    release_date: Date;
    release_date_precision: ReleaseDatePrecision;
    total_tracks: number;
    type: AlbumGroup;
    uri: string;
}

export enum AlbumGroup {
    Album = 'album',
    Single = 'single',
}

export enum ReleaseDatePrecision {
    Day = 'day',
}

export interface ExternalIDS {
    isrc: string;
}

export enum TrackType {
    Track = 'track',
}

export interface VideoThumbnail {
    url: null;
}
