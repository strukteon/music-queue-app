import {JoinCodeManager} from "./JoinCodeManager";
import {UserManager} from "./UserManager";
import {Room} from "./Room";
import {WebsocketManager} from "./WebsocketManager";
import * as http from "http";

export class RoomManager {
    rooms: Array<Room>;
    joinCodeManager: JoinCodeManager;
    userManager: UserManager;
    websocketManager: WebsocketManager;

    constructor(server: http.Server) {
        this.rooms = [];
        this.joinCodeManager = new JoinCodeManager();
        this.userManager = new UserManager();
        this.websocketManager = new WebsocketManager(server, this);
    }

    createRoom(roomName, userUid, createOptions = {}) {
        let room = new Room(this, roomName, userUid);
        this.userManager.getUserByUid(userUid).setRoomUid(room.roomUid);
        this.rooms.push(room);
        let joinCode = this.joinCodeManager.generateJoinCode(room.roomUid);
        room.setJoinCode(joinCode);
        return room;
    }

    getRoomByUid(uid: String) {
        return this.rooms.find(r => r.roomUid === uid);
    }

    generateRoomUid(room) {
        let uniqueId = Math.random();
        return String(uniqueId).substr(2, 16);
    }
}