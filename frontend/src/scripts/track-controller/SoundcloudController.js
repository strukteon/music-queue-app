import { Controller } from "@/scripts/track-controller/Controller";
import { isProxy, toRaw } from 'vue';

import SC from "@/assets/bundles/soundcloud_api";

export class SoundcloudController extends Controller {
    // see https://developers.soundcloud.com/docs/api/html5-widget
    constructor(insertTagId = 'soundcloud') {
        super(insertTagId);
        this.isMuted = false;
    }

    async init() {
        return new Promise(((resolve, reject) => {
            const parent = document.getElementById(this.insertTagId);
            parent.innerHTML = `<iframe id="soundcloud_widget"
                                src="https://w.soundcloud.com/player/?url=https://soundcloud.com/tonemanufacture/cassette-tone-preview&show_artwork=false&liking=false&sharing=false&auto_play=false"
                                width="${this.width}"
                                height="${this.height}"
                                allow="autoplay"
                                frameborder="no"></iframe>`;
            let player = SC.Widget(parent.firstElementChild);

            player.bind(SC.Widget.Events.READY, () => {
                console.log('init(): Soundcloud Iframe ready');
                resolve();
            });
            player.bind(SC.Widget.Events.ERROR, () => {
                reject();
            });
            player.bind(SC.Widget.Events.FINISH, () => { // fires when track ends
                this.onTrackEnd();
            });
            this.player = player;
        }).bind(this));
    }

    async load(service_id) { // async function because loading takes some time and user should not be able to skip through playlist during this
        let player = isProxy(this.player) ? toRaw(this.player) : this.player; // toRaw is required since the soundcloud api just doesn't want to work with proxies
        return new Promise(resolve => {
            player.load('https://soundcloud.com/' + service_id, {callback: () => { // no preceding '/' in id, service_id is like: artist/trackname
                this.onTrackLoaded();
                this.play();
                resolve();
            }});
        });
    }

    mute() {
        if (! this.isMuted) {
            this.player.toggle();
            this.isMuted = true;
        }
    }

    unmute() {
        if (this.isMuted) {
            this.player.toggle();
            this.isMuted = false;
        }
    }

    play() {
        let player = isProxy(this.player) ? toRaw(this.player) : this.player; // toRaw is required since the soundcloud api just doesn't want to work with proxies
        player.play();
        if (this.progressIntervalId === -1)
            this.progressIntervalId = setInterval(async () => {
                this.onTrackProgress(await this.getCurrentTime(), await this.getDuration());
            }, 200);
    }

    pause() {
        let player = isProxy(this.player) ? toRaw(this.player) : this.player; // toRaw is required since the soundcloud api just doesn't want to work with proxies
        player.pause();
        clearInterval(this.progressIntervalId);
        this.progressIntervalId = -1;
    }

    setVolume(vol) {
        let player = isProxy(this.player) ? toRaw(this.player) : this.player; // toRaw is required since the soundcloud api just doesn't want to work with proxies
        player.setVolume(vol);
    }

    skipTo(ms) {
        let player = isProxy(this.player) ? toRaw(this.player) : this.player; // toRaw is required since the soundcloud api just doesn't want to work with proxies
        player.seekTo(ms);
    }

    isPlayable() {
        return new Promise(resolve => this.player.getCurrentSound(sound => {
            resolve(sound.duration === sound.full_duration);
        }));
    }

    async getCurrentTime() {
        let player = isProxy(this.player) ? toRaw(this.player) : this.player; // toRaw is required since the soundcloud api just doesn't want to work with proxies
        return new Promise(resolve =>
            player.getPosition(millis => resolve(millis)));
    }

    async getDuration() {
        let player = isProxy(this.player) ? toRaw(this.player) : this.player; // toRaw is required since the soundcloud api just doesn't want to work with proxies
        return new Promise(resolve =>
            player.getDuration(millis => resolve(millis)));
    }
}