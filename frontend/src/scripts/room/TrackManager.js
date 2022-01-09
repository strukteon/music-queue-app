import {YoutubeTrack} from "@/scripts/track/YoutubeTrack";
import {SoundcloudTrack} from "@/scripts/track/SoundcloudTrack";

export class TrackManager {
    static tracks = [];
    static currentTrack = null;

    static setCurrentTrack(track) {
        this.currentTrack = track;
    }

    static async loadTracks(tracks) {
        this.tracks = tracks;
        await Promise.all(tracks.map(t => t.loadMetadata()));
    }

    static createTrackObject(trackId, platform, userId = null) {
        let TrackClass = null;
        switch (platform) {
            case 'youtube':
                TrackClass = YoutubeTrack;
                break;
            case 'soundcloud':
                TrackClass = SoundcloudTrack;
                break;
            default:
                throw Error('Invalid platform requested!', platform);
        }
        let track = new TrackClass(trackId);
        track.requesterId = userId;
        console.log("userId, use", userId, track)
        return track;
    }

    static getTracks() {
        return this.tracks;
    }

    static getCurrentTrack() {
        return this.currentTrack;
    }
}