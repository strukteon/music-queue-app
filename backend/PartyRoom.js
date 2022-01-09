export class PartyRoom {
    roomManager;
    roomName = null;
    roomId = null;
    creatorId = null;
    queuedTracks = [];
    currentTrack = null;
    roomMembers = new Map();
    bannedUsers = new Set();
    joinCode = null;

    wsConnections = new Map();

    constructor(roomManager, roomName, creatorId) {
        this.roomManager = roomManager;
        this.roomName = roomName;
        this.roomId = this.#generateRoomId();
        this.joinCode = this.#generateJoinCode();
        this.creatorId = creatorId;
        this.roomMembers.set(creatorId, new PartyRoomMember(true));
    }

    addPartyMember(uniqueId) {
        this.roomMembers.set(uniqueId, new PartyRoomMember());
        this.sendBroadcast("user_joined", this.roomManager.getPublicUserId(uniqueId));
    }

    removePartyMember(uniqueId) {
        if (!this.roomMembers.has(uniqueId)) return;
        this.roomMembers.delete(uniqueId)
        this.sendBroadcast("user_left", this.roomManager.getPublicUserId(uniqueId));
    }

    addTrack(track) {
        this.queuedTracks.push(track);
        this.sendBroadcast("updated_track_list");
    }

    removeTrack(index) {
        this.queuedTracks.slice(index, 1);
        this.sendBroadcast("updated_track_list");
    }

    nextTrack() {
        this.currentTrack = this.queuedTracks.shift();
        this.sendBroadcast("next_track_started");
    }

    updateTrackIndex(oldIndex, newIndex) {
        // TODO implement
    }

    sendBroadcast(message, data = null) {
        let wsConnections = this.wsConnections.keys();
        let entry = null;
        while (! (entry = wsConnections.next()).done) {
            entry.value.send(JSON.stringify({
                message,
                data
            }));
        }
    }

    connectWsConnection(ws, uniqueId) {
        this.wsConnections.set(ws, uniqueId);
    }

    #generateRoomId(length = 16) {
        return Buffer.from(Math.random().toString()).toString("base64").substr(10, length);
    }

    #generateJoinCode(length = 6) {
        return Buffer.from(Math.random().toString()).toString("base64").substr(10, length).toUpperCase();
    }

    toJSON() {
        return {
            roomName: this.roomName,
            roomId: this.roomId,
            creatorId: this.roomManager.getPublicUserId(this.creatorId),
            queuedTracks: this.queuedTracks.map(v => ({...v, userId: this.roomManager.getPublicUserId(v.userId)})),
            currentTrack: this.currentTrack == null ? null : {...this.currentTrack, userId: this.roomManager.getPublicUserId(this.currentTrack.userId)},
            roomMembers: Array.from(this.roomMembers, ([k, v]) => ({userId: this.roomManager.getPublicUserId(k), ...v})),
            bannedUsers: Array.from(this.bannedUsers, ([k, v]) => k),
            joinCode: this.joinCode
        }
    }
}

export class PartyRoomMember {
    isAdmin = false;

    constructor(isAdmin = false) {
        this.isAdmin = isAdmin;
    }
}