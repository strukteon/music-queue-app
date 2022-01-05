export class Controller { // abstract class
    constructor(insertTagId = 'service-insert-element-id-here') {
        this.insertTagId = insertTagId;

        if (this.constructor == Controller) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    onTrackEnd() { // fires when track ends, firing must be implemented in subclasses with listeners
        console.log(this.insertTagId + ' track ended');
    }

    setOnTrackEnd(callback) { // is inherited and used to set the next() function to run when a track ended in playlist.js
        this.onTrackEnd = callback;
    }

    async init() {
        // first initialisations and return promise
        throw new Error("Method 'init()' must be implemented.");
    }

    // service_id: the id the service uses for songs
    // also automatically starts to play the video with this.play()
    load(service_id) {
        throw new Error("Method 'load()' must be implemented.");
    }

    play() {
        throw new Error("Method 'play()' must be implemented.");
    }

    pause() {
        throw new Error("Method 'pause()' must be implemented.");
    }

    // vol: 0-100
    setVolume(vol) {
        throw new Error("Method 'setVolume()' must be implemented.");
    }

    // time in milliseconds
    skipTo(ms) {
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
}