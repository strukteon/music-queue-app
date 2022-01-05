import { Controller } from "@/scripts/track-controller/Controller";

export class SoundcloudController extends Controller {
    // see https://developers.soundcloud.com/docs/api/html5-widget
    constructor(insertTagId = 'soundcloud') {
        super(insertTagId);
    }

    async init() {
        const tagid = this.insertTagId;
        return new Promise(((resolve, reject) => {
            const parent = document.getElementById(tagid);
            parent.innerHTML = `<iframe id="soundcloud_widget"
                                src="https://w.soundcloud.com/player/?url=https://soundcloud.com/tonemanufacture/cassette-tone-preview&show_artwork=false&liking=false&sharing=false&auto_play=false"
                                width="${width}"
                                height="${height}"
                                allow="autoplay"
                                frameborder="no"></iframe>`;
            this.player = SC.Widget(parent.firstElementChild);

            this.player.bind(SC.Widget.Events.READY, () => {
                console.log('init(): Soundcloud Iframe ready');
                resolve();
            });
            this.player.bind(SC.Widget.Events.ERROR, () => {
                reject();
            });
            this.player.bind(SC.Widget.Events.FINISH, () => { // fires when track ends
                this.onTrackEnd();
            });
        }).bind(this));
    }

    async load(service_id) { // async function because loading takes some time and user should not be able to skip through playlist during this
        return new Promise(resolve => {
            this.player.load('https://soundcloud.com/' + service_id, {callback: () => { // no preceding '/' in id, service_id is like: artist/trackname
                    //this.play();
                    this.pause();
                    //setTimeout(() => this.play(), 2000); // if somehow still loading
                    resolve();
                }});
        });
    }

    play() {
        this.player.getCurrentSound(sound => this.player.play());
        // this.player.play();
    }

    pause() {
        this.player.pause();
    }

    setVolume(vol) {
        this.player.setVolume(vol);
    }

    skipTo(ms) {
        this.player.seekTo(ms);
    }

    // because Soundcloud API key registration is now locked, only way to access track-metadata is via the embeds -> use second embed on page to fetch metadata when adding link (slower of course)
    async getTrackInfo(service_id) { // warning: do not use with normal track player, only to et infos to track!
        return new Promise(resolve => {
            this.player.load('https://soundcloud.com/' + service_id, {callback: () => {
                    //setTimeout(() => this.play(), 2000); // if somehow still loading
                    this.player.getCurrentSound(sound => resolve(sound));
                }});
        });
    }

    async getCurrentTime() {
        return new Promise(resolve =>
            this.player.getPosition(millis => resolve(millis)));
    }

    async getDuration() {
        return new Promise(resolve =>
            this.player.getDuration(millis => resolve(millis)));
    }
}

