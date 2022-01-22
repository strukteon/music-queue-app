import socketio from "socket.io";
import * as http from "http";
import {RoomManager} from "./RoomManager";

export class WebsocketManager {
    io: socketio.Server;
    roomManager: RoomManager;

    constructor(server: http.Server, roomManager: RoomManager) {
        this.io = new socketio.Server(server);
        this.roomManager = roomManager;

        this.io.use(((socket, next) => {
            const token = socket.handshake.auth.token;
            let userid = this.roomManager.userManager.authenticateUser(token);
            if (! userid)
                return next(new Error("INVALID_TOKEN"));
            let user = this.roomManager.userManager.getUserByUid(userid);
            if (! user || ! user.isInRoom())
                return next(new Error("NOT_IN_ROOM"));

            let room = this.roomManager.getRoomByUid(user.currentRoomUid);

            socket.join(room.roomUid);
            next();
        }));
    }
}