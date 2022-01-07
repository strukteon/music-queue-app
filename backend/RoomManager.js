import ws from "ws";
import { Router } from "express";
import { PartyRoom } from "./PartyRoom.js";
import { generateMessage, generateJsonMessage } from "./helpers.js";
import { UserInfo } from "./User.js";
import Track from "./Track.js";

export class RoomManager {
    router = Router();
    rooms = [];
    users = new Map();
    publicIds = new Map();

    constructor(app, server) {
        let router = Router();


        this.#registerRoomPaths(router);
        this.#registerUserPaths(router);

        this.#startWebsocketServer(server);

        app.use("/api", router);
    }

    #registerRoomPaths(router) {
        router.post("/create-room", (req, res) => {
            const {username, uniqueId, roomName} = req.body;

            if (this.users.has(uniqueId)) {
                res.json(generateMessage(false, "ALREADY_IN_A_ROOM"))
                return;
            }

            let room = new PartyRoom(this, roomName, uniqueId);
            this.addUser(uniqueId, new UserInfo(username, room.roomId));
            this.rooms.push(room);

            res.json(generateMessage(true, "ROOM_CREATED", {room}));
        });

        router.post("/join-room", (req, res) => {
            const {username, uniqueId, joinCode} = req.body;

            if (this.users.has(uniqueId)) {
                res.json(generateMessage(false, "ALREADY_IN_A_ROOM"))
                return;
            }

            let room = this.findRoomByJoinCode(joinCode);
            if (room == null) {
                res.json(generateMessage(false, "INVALID_JOIN_CODE"))
                return;
            }

            if (room.bannedUsers.has(uniqueId)) {
                res.json(generateMessage(false, "BANNED_FROM_ROOM"))
                return;
            }

            this.addUser(uniqueId, new UserInfo(username, room.roomId));
            room.addPartyMember(uniqueId);

            res.json(generateMessage(true, "JOINED_ROOM", {roomId: room.roomId}));
        });

        router.post("/leave-room", (req, res) => {
            const { uniqueId } = req.body;

            if (!this.users.has(uniqueId)) {
                res.json(generateMessage(false, "NOT_IN_A_ROOM"))
                return;
            }

            let user = this.users.get(uniqueId);
            let room = this.findRoomById(user.roomId);
            room.removePartyMember(uniqueId);
            this.publicIds.forEach((v, k) => v === uniqueId ? this.publicIds.delete(k) : null);

            res.json(generateMessage(true, "LEFT_ROOM"));
        });

        router.post("/room/add-track", (req, res) => {
            const { uniqueId, trackId, platform } = req.body;

            if (!this.users.has(uniqueId)) {
                res.json(generateMessage(false, "NOT_IN_A_ROOM"))
                return;
            }
            let user = this.users.get(uniqueId);
            let room = this.findRoomById(user.roomId);
            let track = new Track(uniqueId, trackId, platform);
            room.addTrack(track);

            res.json(generateMessage(true, "ADDED_TRACK"));
        });

        router.post("/room/next-track", (req, res) => {
            const { uniqueId } = req.body;

            if (!this.users.has(uniqueId)) {
                res.json(generateMessage(false, "NOT_IN_A_ROOM"))
                return;
            }
            let user = this.users.get(uniqueId);
            let room = this.findRoomById(user.roomId);

            if (! room.roomMembers.get(uniqueId).isAdmin) {
                res.json(generateMessage(false, "MUST_BE_ADMIN"))
                return;
            }

            room.nextTrack();

            res.json(generateMessage(true, "NEXT_TRACK_REQUESTED"));
        });

        router.post("/room/remove-track", (req, res) => {

        });

        router.post("/room/change-track-index", (req, res) => {

        })

        router.post("/room/list-tracks", (req, res) => {
            const { uniqueId } = req.body;

            if (!this.users.has(uniqueId)) {
                res.json(generateMessage(false, "NOT_IN_A_ROOM"))
                return;
            }
            let user = this.users.get(uniqueId);
            let room = this.findRoomById(user.roomId);

            res.json(generateMessage(true, null, { queuedTracks: room.queuedTracks, currentTrack: room.currentTrack }))
        })
    }

    #registerUserPaths(router) {
        router.post("/users/@me", (req, res) => {
            const { uniqueId } = req.body;
            if (!this.users.has(uniqueId)) {
                res.json(generateMessage(false, "NOT_IN_A_ROOM"))
                return;
            }

            let user = this.users.get(uniqueId);

            res.json(generateMessage(true, null, {...user}))
        });

        router.post("/users/:userid", (req, res) => {
            let uniqueId = this.getUniqueUserId(req.params.userid);
            if (uniqueId == null) {
                res.json(generateMessage(false, "USER_DOES_NOT_EXIST"))
                return;
            }

            let user = this.users.get(uniqueId);

            res.json(generateMessage(true, null, {...user}))
        });
    }

    #startWebsocketServer(server) {
        let wss = new ws.Server({ server });
        let authenticatedWs = new Set();

        wss.on("connection", ws => {

            ws.on("message", msg => {
                let message = null;
                try {
                    message = JSON.parse(msg.toString());
                } catch (e) { return; }

                if (authenticatedWs.has(ws)) {
                    ws.send(generateJsonMessage(false, "connection already authenticated"));
                    return;
                }
                if (! message.uniqueId) {
                    ws.send(generateJsonMessage(false, "uniqueId must be specified"));
                    return;
                }
                if (! this.users.has(message.uniqueId)) {
                    ws.send(generateJsonMessage(false, "invalid uniqueId"));
                    return;
                }

                let user = this.users.get(message.uniqueId);
                let room = this.findRoomById(user.roomId);
                room.connectWsConnection(ws, message.uniqueId);
            })
        })
    }

    findRoomByJoinCode(joinCode) {
        return this.rooms.find(room => room.joinCode && room.joinCode === joinCode);
    }

    findRoomById(roomId) {
        return this.rooms.find(room => room.roomId === roomId);
    }

    addUser(uniqueId, userInfo) {
        console.log(uniqueId, "added")
        this.users.set(uniqueId, userInfo);
        this.publicIds.set(userInfo.publicId, uniqueId)
    }

    getPublicUserId(uniqueId) {
        return this.users.get(uniqueId)?.publicId;
    }

    getUniqueUserId(publicId) {
        return this.publicIds.get(publicId);
    }

}

