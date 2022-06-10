export class Track {
    requesterUid;
    trackId;
    platform;

    static SUPPORTED_PLATFORMS = ["youtube", "soundcloud"];

    constructor(userId, trackId, platform) {
        this.requesterUid = userId;
        this.trackId = trackId;
        this.platform = platform;
    }

    platformIsSupported() {
        return Track.SUPPORTED_PLATFORMS.indexOf(this.platform) !== -1;
    }
}