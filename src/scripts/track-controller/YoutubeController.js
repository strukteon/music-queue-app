import { Controller } from "@/scripts/track-controller/Controller";

export class YoutubeController extends Controller {
    // see https://developers.google.com/youtube/iframe_api_reference
    constructor(insertTagId = 'youtube') {
        super(insertTagId);
    }

    async init() {
        return new Promise((resolve, reject) => {
            YT.ready(() => {
                this.player = new YT.Player(this.insertTagId, {
                    height: super.height, // set to 0
                    width: super.width,
                    videoId: 'CVDHQokn7mQ', // default video (cassette sound) so that iframe can load
                    events: {
                        'onReady': () => { console.log('init(): Youtube Iframe ready'); resolve(); },
                        'onError': reject,
                        'onStateChange': event => {
                            if(event.data === 0) {
                                this.onTrackEnd(); // fired when video ends
                            }
                        }
                    }
                })
            });
        })
    }

    load(service_id) {
        //this.play();
        this.player.loadVideoById(service_id);
        this.pause();
        //this.play();
    }

    play() {
        this.player.unMute();
        this.player.playVideo();
    }

    pause() {
        this.player.pauseVideo();
    }

    setVolume(vol) {
        this.player.setVolume(vol);
    }

    skipTo(ms) {
        this.player.seekTo(ms / 1000, true);
    }

    async getCurrentTime() {
        return this.player.getCurrentTime() * 1000;
    }

    async getDuration() {
        return this.player.getDuration() * 1000;
    }
}