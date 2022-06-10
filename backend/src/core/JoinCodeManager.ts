export class JoinCodeManager {
    joinCodes;

    constructor() {
        this.joinCodes = new Map();
    }

    generateJoinCode(roomUid) {
        let joinCode = JoinCodeManager.#genCode();
        while (this.joinCodes.has(joinCode)) joinCode = JoinCodeManager.#genCode();
        this.joinCodes.set(joinCode, roomUid);
        return joinCode;
    }

    getRoomUidFromJoinCode(joinCode) {
        return this.joinCodes.get(joinCode);
    }

    removeJoinCodesForRoom(roomUid) {
        for (let [key, val] of this.joinCodes.entries) {
            if (val === roomUid)
                this.joinCodes.delete(key);
        }
    }

    static #genCode(length = 6) {
        return Buffer.from(Math.random().toString()).toString("base64").substr(10, length).toUpperCase();
    }
}