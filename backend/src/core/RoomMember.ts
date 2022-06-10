export class RoomMember {
    uid;
    nickname;
    isAdmin;

    constructor(uid, isAdmin) {
        this.uid = uid;
        this.isAdmin = isAdmin;
        this.nickname = null;
    }
}