import { Controller } from "@/scripts/track-controller/Controller";
import YoutubeIframeLoader from "youtube-iframe";

export class YoutubeController extends Controller {
    // see https://developers.google.com/youtube/iframe_api_reference
    constructor(insertTagId = 'youtube') {
        super(insertTagId);
    }

    async init() {
        return new Promise((resolve, reject) => {
            YoutubeIframeLoader.load(YT =>
                this.player = new YT.Player(this.insertTagId, {
                    height: this.height, // set to 0
                    width: this.width,
                    videoId: 'CVDHQokn7mQ', // default video (cassette sound) so that iframe can load
                    events: {
                        'onReady': () => {
                            document.getElementById(this.insertTagId).setAttribute("width", "0")
                            document.getElementById(this.insertTagId).setAttribute("height", "0")
                            resolve();
                            },
                        'onError': reject,
                        'onStateChange': event => {
                            if(event.data === 0) {
                                this.onTrackEnd(); // fired when video ends
                            }
                        }
                    }
                })
            )
        })
    }

    load(trackId) {
        this.trackId = trackId;
        //this.play();
        this.player.loadVideoById(trackId);
        this.pause();
        this.onTrackLoaded();
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

    getCurrentTime() {
        return this.player.getCurrentTime() * 1000;
    }

    getDuration() {
        return this.player.getDuration() * 1000;
    }
}