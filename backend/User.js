export class UserInfo {
    username = null;
    publicId = null;
    roomId = null;

    constructor(username, roomId) {
        this.username = username;
        this.roomId = roomId;
        this.publicId = (Math.floor(Number.MAX_SAFE_INTEGER * Math.random()) + '').padStart(16, '0')
    }
}