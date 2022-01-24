import {YoutubeTrack} from "@/scripts/track/YoutubeTrack";
import {SoundcloudTrack} from "@/scripts/track/SoundcloudTrack";

export class TrackManager {
    static queuedTracks = [];
    static currentTrack = null;

    static async loadCurrentTrack(track) {
        this.currentTrack = track;
        await track.loadMetadata();
    }

    static pullNextTrack() {
        this.currentTrack = this.queuedTracks.shift();
    }

    static async loadQueuedTracks(tracks) {
        this.queuedTracks = tracks;
        await Promise.all(tracks.map(t => t.loadMetadata()));
    }

    static async addQueuedTrack(track) {
        this.queuedTracks.push(track);
        await track.loadMetadata();
    }

    static createTrackObject({trackId, platform, requesterUid}) {
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
        track.setRequesterUid(requesterUid);
        return track;
    }

    static getQueuedTracks() {
        return this.queuedTracks;
    }

    static getCurrentTrack() {
        return this.currentTrack;
    }
}