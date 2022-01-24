import { Controller } from "@/scripts/track-controller/Controller";
import YT from "@/assets/bundles/youtube_api";

export class YoutubeController extends Controller {
    // see https://developers.google.com/youtube/iframe_api_reference
    constructor(insertTagId = 'youtube') {
        super(insertTagId);
    }

    async init() {
        return new Promise((resolve, reject) => {
            YT.ready(() =>
                this.player = new window.YT.Player(this.insertTagId, {
                    height: this.height, // set to 0
                    width: this.width,
                    videoId: 'CVDHQokn7mQ', // default video (cassette sound) so that iframe can load
                    events: {
                        'onReady': () => {
                            resolve();
                            },
                        'onError': reject,
                        'onStateChange': event => {
                            if(event.data === 0) {
                                this.onTrackEnd(); // fired when video ends
                            } else if (event.data === -1) {
                                this.onTrackLoaded();
                            }
                        }
                    }
                })
            )
        })
    }

    load(trackId, startSeconds = 0) {
        this.trackId = trackId;
        //this.play();
        this.player.loadVideoById(trackId, startSeconds, "small");
        this.pause();
        this.onTrackLoaded();
    }

    mute() {
        this.player.mute();
    }

    unmute() {
        this.player.unMute();
    }

    play() {
        this.player.unMute();
        this.player.playVideo();
        if (this.progressIntervalId === -1)
            this.progressIntervalId = setInterval(() => {
                this.onTrackProgress(this.getCurrentTime(), this.getDuration());
            }, 200);
    }

    pause() {
        this.player.pauseVideo();
        clearInterval(this.progressIntervalId);
        this.progressIntervalId = -1;
    }

    setVolume(vol) {
        this.player.setVolume(vol);
    }

    skipTo(ms) {
        this.player.seekTo(ms / 1000, true);
    }

    async isPlayable() {
        return this.player.getAvailableQualityLevels().length > 0;
    }

    getCurrentTime() {
        return this.player.getCurrentTime() * 1000;
    }

    getDuration() {
        return this.player.getDuration() * 1000;
    }
}