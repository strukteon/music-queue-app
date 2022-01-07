import axios from "axios";

export default class {
    static url = "http://localhost/api";
    static websocketUrl = "ws://localhost";

    static setUniqueId(uniqueId) {
        this.uniqueId = uniqueId;
    }

    static loadUniqueId() {
        if (this.uniqueId === undefined)
            this.uniqueId = localStorage.getItem("uniqueId");
    }

    static async createRoom(username, roomName) {
        this.loadUniqueId();
        console.log(this.uniqueId)
        return (await axios.post(`${this.url}/create-room`, {
            uniqueId: this.uniqueId,
            username,
            roomName
        })).data;
    }

    static async joinRoom(username, joinCode) {
        this.loadUniqueId();
        return (await axios.post(`${this.url}/join-room`, {
            uniqueId: this.uniqueId,
            username,
            joinCode
        })).data;
    }

    static async leaveRoom() {
        this.loadUniqueId();
        return (await axios.post(`${this.url}/leave-room`, {
            uniqueId: this.uniqueId
        })).data;
    }

    static async getRoomData() {
        this.loadUniqueId();
        return (await axios.post(`${this.url}/room`, {
            uniqueId: this.uniqueId
        })).data;
    }

    static async roomAddTrack(trackId, platform) {
        this.loadUniqueId();
        return (await axios.post(`${this.url}/room/add-track`, {
            uniqueId: this.uniqueId,
            trackId,
            platform
        })).data;
    }

    static async roomNextTrack() {
        this.loadUniqueId();
        return (await axios.post(`${this.url}/room/next-track`, {
            uniqueId: this.uniqueId
        })).data;
    }

    static async roomListTracks() {
        this.loadUniqueId();
        return (await axios.post(`${this.url}/room/list-tracks`, {
            uniqueId: this.uniqueId
        })).data;
    }

    static async getUser(userId = "@me") {
        this.loadUniqueId();
        return (await axios.post(`${this.url}/users/${userId}`, {
            uniqueId: this.uniqueId
        })).data;
    }
}