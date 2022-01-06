export class Controller { // abstract class
    width = 0;
    height = 0;

    constructor(insertTagId = 'service-insert-element-id-here') {
        this.insertTagId = insertTagId;
        this.progressIntervalId = -1;

        if (this.constructor == Controller) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    async init() {
        // first initialisations and return promise
        throw new Error("Method 'init()' must be implemented.");
    }

    // service_id: the id the service uses for songs
    // also automatically starts to play the video with this.play()
    load(trackId) { // eslint-disable-line no-unused-vars
        throw new Error("Method 'load()' must be implemented.");
    }

    play() {
        throw new Error("Method 'play()' must be implemented.");
    }

    pause() {
        throw new Error("Method 'pause()' must be implemented.");
    }

    // vol: 0-100
    setVolume(vol) { // eslint-disable-line no-unused-vars
        throw new Error("Method 'setVolume()' must be implemented.");
    }

    // time in milliseconds
    skipTo(ms) { // eslint-disable-line no-unused-vars
        throw new Error("Method 'skipTo()' must be implemented.");
    }

    // time returned in milliseconds
    async getCurrentTime() {
        throw new Error("Method 'getCurrentTime()' must be implemented.");
    }

    // time returned in milliseconds
    async getDuration() {
        throw new Error("Method 'getDuration()' must be implemented.");
    }

    async getThumbnailUrl() {
        throw new Error("Method 'getThumbnailUrl()' must be implemented.");
    }




    onTrackEnd() { // fires when track ends, firing must be implemented in subclasses with listeners
        console.log(this.insertTagId + ' track ended');
    }

    setOnTrackEnd(callback) { // is inherited and used to set the next() function to run when a track ended in playlist.js
        this.onTrackEnd = callback;
    }

    onTrackLoaded() { }

    setOnTrackLoaded(callback) {
        this.onTrackLoaded = callback;
    }

    onTrackProgress(position, duration) { } // eslint-disable-line no-unused-vars

    setOnTrackProgress(callback) {
        this.onTrackProgress = callback;
    }

    removeEventListeners() {
        this.setOnTrackEnd(() => {});
        this.setOnTrackLoaded(() => {});
        this.setOnTrackProgress(() => {});
    }
}