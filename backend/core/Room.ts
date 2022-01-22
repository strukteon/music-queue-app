import {RoomMemberManager} from "./RoomMemberManager";
import {TrackManager} from "./TrackManager";
import {RoomManager} from "./RoomManager";

export class Room {
    roomUid: string;
    roomName: string;
    ownerUid: string;
    roomManager: RoomManager;
    roomMemberManager: RoomMemberManager;
    trackManager: TrackManager;

    constructor(roomManager, roomName, ownerUid) {
        this.roomManager = roomManager;
        this.roomName = roomName;
        this.ownerUid = ownerUid;
        this.roomUid = this.roomManager.generateRoomUid(this);
        this.roomMemberManager = new RoomMemberManager(this);
        this.trackManager = new TrackManager(this);

        this.roomMemberManager.addMember(ownerUid, true);
    }

    emit(ev, ...args) {
        this.roomManager.websocketManager.io.in(this.roomUid).emit(ev, args);
    }

    toObj() {
        return {
            roomUid: this.roomUid,
            roomName: this.roomName,
            ownerUid: this.ownerUid
        }
    }
}