import {RoomMember} from "./RoomMember";
import {Room} from "./Room";

export class RoomMemberManager {
    room: Room;
    members: Map<String, RoomMember>;
    bannedUsers: Set<RoomMember>;

    constructor(room) {
        this.room = room;
        this.members = new Map();
        this.bannedUsers = new Set();
    }

    addMember(uid, isAdmin = false) {
        if (this.members.has(uid))
            throw new Error("user already in room");
        if (this.userIsBanned(uid))
            throw new Error("user cannot join, is banned");
        let roomMember = new RoomMember(uid, isAdmin);
        this.members.set(uid, roomMember);
        this.room.emit("USER_JOINED", uid);
    }

    removeMember(uid) {
        if (! this.members.has(uid))
            throw new Error("user not in room");
        this.members.delete(uid);
        this.room.roomManager.userManager.getUserByUid(uid)?.clearRoomUid();
        this.room.emit("USER_LEFT", uid);
    }

    getMember(uid) {
        return this.members.get(uid);
    }

    getAllMembers() {
        return Array.from(this.members.values());
    }

    banUser(uid) {
        if (this.bannedUsers.has(uid))
            throw new Error("user already banned");
        this.bannedUsers.add(uid);
        if (this.members.has(uid))
            this.removeMember(uid);
    }

    unbanUser(uid) {
        if (! this.bannedUsers.has(uid))
            throw new Error("user not banned");
        this.bannedUsers.delete(uid);
    }

    userIsBanned(uid) {
        return this.bannedUsers.has(uid);
    }

}