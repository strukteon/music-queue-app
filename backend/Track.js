export default class Track {
    userId = null;
    trackId = null;
    platform = null;

    constructor(userId, trackId, platform) {
        this.userId = userId;
        this.trackId = trackId;
        this.platform = platform;
    }
}