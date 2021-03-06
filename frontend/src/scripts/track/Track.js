export class Track {
    trackName = null;
    artist = null;
    thumbnailUrl = null;
    position = 0;
    duration = NaN; // in ms
    requesterUid = null;
    platformName = null;

    constructor(trackId, platform = 'no-platform') {
        this.trackId = trackId;
        this.platform = platform;
    }

    setRequesterUid(uid) {
        this.requesterUid = uid;
    }

    async loadMetadata() {
        throw new Error("Method 'loadMetadata()' must be implemented.");
    }

    setProgress(position, duration) {
        this.position = position;
        this.duration = duration;
    }
}