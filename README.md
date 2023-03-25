# Spotify example

## Introduction

This is a spotify example that gets the current playing track for a user and displays it, along with some information
about the queue and playlist.

## Environment and Spotify developer account

-   Setup your application from your spotify developers portal and get your Client ID and Secret.
-   Create a `.env` file in the root folder with the following:

```
PUBLIC_CLIENT_ID=<YOUR_CLIENT_ID>
CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```

-   Make sure that your Spotify's project settings has the correct redirect URI in `Redirect URIs`. To do so, go
    to the application's settings on your Spotify Developer portal.

## Quick start

To spin up a development server,

```
npm i
npm run dev
```
