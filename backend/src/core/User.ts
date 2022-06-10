import crypto from "crypto";

export class User {
    uid;
    username;
    currentRoomUid: String;

    constructor(uid, username) {
        this.uid = uid;
        this.username = username;
        this.currentRoomUid = null;
    }

    setUsername(username) {
        this.username = username;
    }

    setRoomUid(uid) {
        this.currentRoomUid = uid;
    }

    clearRoomUid() {
        this.currentRoomUid = null;
    }

    isInRoom() {
        return this.currentRoomUid !== null;
    }

    async authenticateUser(key) {
        let hash = crypto.createHash('md5').update(key).digest("hex");
        return String(parseInt(hash, 16)).substr(2, 16);
    }
}