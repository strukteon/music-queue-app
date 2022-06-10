import {checkCaptcha} from "./Security";
import {RoomManager} from "./RoomManager";
import {generateMessage} from "./Messages";
import {Router} from "express";
import {Track} from "./Track";

export function setup(router: Router, roomManager: RoomManager) {
    roomPaths(router, roomManager);
    userPaths(router, roomManager);

    const showUnsupportedOpMessage = (req, res) => res.json(generateMessage(false, "Unsupported operation"));
    router.get("*", showUnsupportedOpMessage);
    router.post("*", showUnsupportedOpMessage);
}

function roomPaths(router: Router, roomManager: RoomManager) {

    /**
     * /room/create
     * /room/join
     * /room/leave
     * /room
     * /room/tracks/add
     * /room/tracks/remove (index)
     * /room/tracks/next
     * /room/tracks/move
     * /room/tracks
     * /room/members
     * /room/members/:memberid
     */

    router.post("/room/create", (req, res) => {
        const {username, uniqueId, roomName} = req.body;
        if (!checkCaptcha(req, res))
            return;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);
        if (! user) user = roomManager.userManager.addUser(userUid, username);

        if (user.isInRoom())
            return res.json(generateMessage(false, "ALREADY_IN_ROOM"));

        user.setUsername(username);

        let room = roomManager.createRoom(roomName, userUid);

        res.json(generateMessage(true, "ROOM_CREATED", { roomId: room.roomUid }));
    });


    router.post("/room/join", (req, res) => {
        const {username, uniqueId, joinCode} = req.body;
        if (!checkCaptcha(req, res))
            return;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);
        if (! user) user = roomManager.userManager.addUser(userUid, username);

        if (user.isInRoom())
            return res.json(generateMessage(false, "ALREADY_IN_ROOM"));

        let roomUid = roomManager.joinCodeManager.getRoomUidFromJoinCode(joinCode);
        if (roomUid == null)
            return res.json(generateMessage(false, "INVALID_JOIN_CODE"));

        let room = roomManager.getRoomByUid(roomUid);

        if (room.roomMemberManager.userIsBanned(userUid))
            return res.json(generateMessage(false, "BANNED_FROM_ROOM"))

        room.roomMemberManager.addMember(userUid);
        user.setRoomUid(room.roomUid);

        res.json(generateMessage(true, "JOINED_ROOM", {roomId: room.roomUid}));
    });


    router.post("/room/leave", (req, res) => {
        const {uniqueId} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        room.roomMemberManager.removeMember(user.uid);
        user.clearRoomUid();

        res.json(generateMessage(true, "LEFT_ROOM"));
    });


    router.post("/room", (req, res) => {
        const {uniqueId} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        res.json(generateMessage(true, null, room.toObj()));
    });


    router.post("/room/tracks/add", (req, res) => {
        const {uniqueId, trackId, platform} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);
        let track = new Track(userUid, trackId, platform);
        if (! track.platformIsSupported())
            return res.json(generateMessage(false, "PLATFORM_NOT_SUPPORTED"));

        room.trackManager.addTrack(track);

        res.json(generateMessage(true, "TRACK_ADDED"));
    });


    router.post("/room/tracks/remove", (req, res) => {
        const {uniqueId, trackIndexes} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        if (! room.roomMemberManager.getMember(user.uid).isAdmin)
            return res.json(generateMessage(false, "MUST_BE_ADMIN"));

        room.trackManager.removeTracksByIndex(trackIndexes);

        res.json(generateMessage(true, "TRACKS_REMOVED"));
    });


    router.post("/room/tracks/next", (req, res) => {
        const {uniqueId} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        if (! room.roomMemberManager.getMember(user.uid).isAdmin)
            return res.json(generateMessage(false, "MUST_BE_ADMIN"));

        room.trackManager.pullTrackFromQueue();

        res.json(generateMessage(true, "NEXT_TRACK_REQUESTED"));
    });


    router.post("/room/tracks/move", (req, res) => {
        const {uniqueId, trackIndex, positionDelta} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        if (! room.roomMemberManager.getMember(user.uid).isAdmin)
            return res.json(generateMessage(false, "MUST_BE_ADMIN"));

        room.trackManager.moveTrackByIndex(trackIndex, positionDelta);

        res.json(generateMessage(true, "TRACKS_REMOVED"));
    });


    router.post("/room/tracks", (req, res) => {
        const {uniqueId} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        res.json(generateMessage(true, null, {
            currentTrack: room.trackManager.getCurrentTrack(),
            queuedTracks: room.trackManager.getQueuedTracks(),
        }));
    });


    router.post("/room/members", (req, res) => {
        const {uniqueId} = req.body;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        res.json(generateMessage(true, null, room.roomMemberManager.getAllMembers()));
    });


    router.post("/room/members/:memberid", (req, res) => {
        const {uniqueId} = req.body;
        const memberid = req.params.memberid;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let room = roomManager.getRoomByUid(user.currentRoomUid);

        res.json(generateMessage(true, null, room.roomMemberManager.getMember(memberid)));
    });

}

function userPaths(router, roomManager) {

    /**
     * /users/@me
     * /users/:userid
     */


    router.post("/users/:userid", (req, res) => {
        const {uniqueId} = req.body;
        let userid = req.params.userid;

        let userUid = roomManager.userManager.authenticateUser(uniqueId);
        let user = roomManager.userManager.getUserByUid(userUid);

        if (! user || ! user.isInRoom())
            return res.json(generateMessage(false, "NOT_IN_A_ROOM"));

        let requestedUser = roomManager.userManager.getUserByUid(userid === "@me" ? user.uid : userid);

        res.json(generateMessage(true, null, requestedUser));
    });

}
