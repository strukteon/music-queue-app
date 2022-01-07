import BackendController from "@/scripts/BackendController";

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
            this.vue.roomData.currentTrack = response.data.currentTrack;
            this.vue.roomData.queuedTracks = response.data.queuedTracks;
        } else if (msg.message === "user_joined") {
            this.vue.roomData.roomMembers.push({ userId: msg.data, isAdmin: false });
        } else if (msg.message === "user_left") {
            this.vue.roomData.roomMembers.forEach((v, i) => v.userId === msg.data ?
                this.vue.roomData.roomMembers.splice(i, 1) : null);
        } else if (msg.message === "next_track_started") {
            let response = await BackendController.roomListTracks();
            this.vue.roomData.currentTrack = response.data.currentTrack;
            this.vue.roomData.queuedTracks = response.data.queuedTracks;
        }
    }

}