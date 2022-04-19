import { io } from "socket.io-client";
import BackendController from "@/scripts/BackendController";
import {TrackManager} from "@/scripts/room/TrackManager";
import {MemberManager} from "@/scripts/room/MemberManager";

export class RoomWebsocketHandler {
    socket;
    vue;

    constructor(roomVueObject) {
        this.vue = roomVueObject;
        BackendController.loadUniqueId()
        this.socket = io(BackendController.domain, {
            auth: {
                token: BackendController.uniqueId
            }
        });

        this.socket.on("connect_error", x => {
            console.log("couldnt connect to socket:", x);
        });

        this.socket.on("connect", x => {
            console.log("connected:", x);
        });

        this.registerUserEvents();
    }

    registerUserEvents() {
        this.socket.on("data", x => {
            console.log("data:", x);
        });
        this.socket.on("USER_JOINED", async data => {
            await MemberManager.loadMember(data[0]);
            this.vue.roomMembers = [...MemberManager.getAllMembers()];
        });
        this.socket.on("USER_LEFT", async data => {
            await MemberManager.removeMember(data[0]);
            this.vue.roomMembers = [...MemberManager.getAllMembers()];
        });
        this.socket.on("TRACK_ADDED", async data => {
            await TrackManager.addQueuedTrack(TrackManager.createTrackObject(data[0]));
            this.vue.queuedTracks = [...TrackManager.getQueuedTracks()];
        });
        /*eslint-disable*/
        this.socket.on("NEXT_TRACK_STARTED", async () => {
            TrackManager.pullNextTrack();
            this.vue.queuedTracks = [...TrackManager.getQueuedTracks()];
            this.vue.currentTrack = TrackManager.getCurrentTrack();

            if (this.vue.$refs["track-controller"].isInitialized)
                await this.vue.$refs["track-controller"].loadTrack(this.vue.currentTrack);
        });
        this.socket.on("TRACKS_REMOVED", async data => {
        });
        this.socket.on("TRACKS_REMOVED_BY_MEMBER_UID", async data => {
        });
        this.socket.on("UPDATED_TRACK_INDEX", async data => {
        });
        /*eslint-ensable*/
    }

    registerTrackEvents() {

    }
}
