import BackendController from "@/scripts/BackendController";
import {getPlatformClass} from "@/scripts/room/RoomHelper";
import {TrackManager} from "@/scripts/room/TrackManager";
import {UserManager} from "@/scripts/room/UserManager";

export default class {
    vue = null;

    constructor(vue) {
        this.vue = vue;
        this.ws = new WebSocket(BackendController.websocketUrl);

        this.ws.addEventListener("open", () => {
            this.sendAuthenticationMessage();
        });

        this.ws.addEventListener("message", event => {
            const message = JSON.parse(event.data);
            this.handleWebsocketMessage(message);
        })
    }

    sendAuthenticationMessage() {
        BackendController.loadUniqueId();

        this.ws.send(JSON.stringify({
            uniqueId: BackendController.uniqueId,
        }));
    }

    async handleWebsocketMessage(msg) {
        if (msg.message === "updated_track_list") {
            let response = await BackendController.roomListTracks();
            await TrackManager.loadTracks(response.data.queuedTracks.map(v => TrackManager.createTrackObject(v.trackId, v.platform, v.userId)));
            this.vue.queuedTracks = TrackManager.getTracks();
        } else if (msg.message === "user_joined") {
            await UserManager.loadUser(msg.data);
            this.vue.roomMembers = UserManager.getAllUsers();
        } else if (msg.message === "user_left") {
            await UserManager.removeUser(msg.data);
            this.vue.roomMembers = UserManager.getAllUsers();
        } else if (msg.message === "next_track_started") {
            let response = await BackendController.roomListTracks();
            this.vue.roomData.currentTrack = response.data.currentTrack;
            if (this.vue.roomData.currentTrack != null) {
                let trackClass = getPlatformClass(this.vue.roomData.currentTrack.platform);
                let track = new trackClass(this.vue.roomData.currentTrack.trackId);
                await track.loadMetadata();
                await this.vue.$refs["track-controller"].loadTrack(track);
                this.vue.$refs["track-controller"].activeController.play();
            }

            await TrackManager.loadTracks(response.data.queuedTracks.map(v => TrackManager.createTrackObject(v.trackId, v.platform, v.userId)));
            this.vue.queuedTracks = TrackManager.getTracks();
        }
    }

}