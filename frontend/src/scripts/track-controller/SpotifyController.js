import { Controller } from "@/scripts/track-controller/Controller";

export class SpotifyController extends Controller {
    // see https://developer.spotify.com/documentation/web-playback-sdk/quick-start
    // also https://developer.spotify.com/documentation/web-playback-sdk/reference/#playing-a-spotify-uri

    constructor(insertTagId = 'spotify') {
        super(insertTagId);
        this.access_token = 'access-token-not-set';
        this.device_id = 'device-id-not-set';
    }

    // page must be accessed via https (not just locahost/http), otherwise spotify drm does not work
    async waitForSpotifyPlaybackReady() { // because of weird behavior when spotify script is already loaded
        return new Promise(resolve => {
            if (window.Spotify) {
                resolve(window.Spotify);
            } else {
                window.onSpotifyWebPlaybackSDKReady = () => {
                    resolve(window.Spotify);
                };
            }
        });
    };

    async init(access_token) { // the access_token of the user obtained after the user authorised your spotify application with the required scopes
        const tagid = this.insertTagId;
        return new Promise(async (resolve, reject) => {
            await this.waitForSpotifyPlaybackReady();

            this.access_token = access_token;

            this.player = new Spotify.Player({
                name: 'Embed Controller',
                getOAuthToken: cb => { cb(this.access_token); }
            });

            // Error handling
            this.player.addListener('initialization_error', ({ message }) => { /*console.error(message);*/ reject('Spotify Initialization: ' + message); });
            this.player.addListener('authentication_error', ({ message }) => { /*console.error(message);*/ reject('Spotify Authentication: ' + message); });
            this.player.addListener('account_error', ({ message }) => { /*console.error(message);*/ reject('Spotify Account: ' + message); });
            this.player.addListener('playback_error', ({ message }) => { /*console.error(message); reject(message);*/ }); // many unnecessary console.errors

            // Playback status updates
            this.player.addListener('player_state_changed', state => {
                console.log(state);
                // workaround for track ended event: https://github.com/spotify/web-playback-sdk/issues/35
                if (
                    this.state
                    && state.track_window.previous_tracks.find(x => x.id === state.track_window.current_track.id)
                    && !this.state.paused
                    && state.paused
                ) {
                    this.onTrackEnd();
                }
                this.state = state;
            });

            // Ready
            this.player.addListener('ready', ({ device_id }) => {
                console.log('init(): Spotify Playback ready');
                this.device_id = device_id;
                // console.log('Ready with Device ID', device_id);
                resolve();
            });

            // Not Ready
            this.player.addListener('not_ready', ({ device_id }) => {
                // console.log('Device ID has gone offline', device_id);
                reject('not_ready: Device ID has gone offline ' + device_id);
            });

            // Connect to the player!
            this.player.connect();
        });
    }

    async load(service_id) {
        const spotify_uri = 'spotify:track:' + service_id;
        // Play new song, must be dont via api endpoint:
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.device_id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.access_token}`
            }
        });
        this.pause();
    }

    play() {
        // Resume current song:
        this.player.resume().then(() => {
        });
    }

    pause() {
        // Pause current song:
        this.player.pause().then(() => {
        });
    }

    setVolume(vol) {
        // Set volume of player:
        this.player.setVolume(vol/100).then(() => {
        });
    }

    skipTo(ms) {
        // Seek to ms of currently playing song:
        this.player.seek(ms).then(() => {
        });
    }

    isPlayable() {
        return true;
    }

    async getCurrentTime() {
        if (!this.state?.position) return 0;
        return this.state.position;
    }

    async getDuration() {
        if (!this.state?.duration) return 0;
        return this.state.duration;
    }
}