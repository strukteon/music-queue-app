export class Track {
    trackName = null;
    artist = null;
    thumbnailUrl = null;
    position = 0;
    duration = NaN; // in ms

    constructor(trackId, platform = 'no-platform') {
        this.trackId = trackId;
        this.platform = platform;
    }

    async loadMetadata() {
        throw new Error("Method 'loadMetadata()' must be implemented.");
    }

    setProgress(position, duration) {
        this.position = position;
        this.duration = duration;
    }
}