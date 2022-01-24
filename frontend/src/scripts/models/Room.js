import BackendController from "@/scripts/BackendController";
import {User} from "@/scripts/models/Users";


class Tracks {

    static url = "/room/tracks";

    static async add(track) {
        return await BackendController.makeRequest(`${this.url}/add`, { trackId: track.trackId, platform: track.platform });
    }

    static async remove(trackIndexes = []) {
        return await BackendController.makeRequest(`${this.url}/remove`, { trackIndexes });
    }

    static async next() {
        return await BackendController.makeRequest(`${this.url}/next`);
    }

    static async move(trackIndex, positionDelta) {
        return await BackendController.makeRequest(`${this.url}/next`, { trackIndex, positionDelta });
    }

    static async getAll() {
        return await BackendController.makeRequest(`${this.url}`);
    }
}

class Member {

    static url = "/room/members";

    uid;
    nickname;
    isAdmin;

    static async getAll() {
        let res = await BackendController.makeRequest(`${this.url}`);
        if (! res.success || res.data === null) return null;
        let arr = [];
        for (let m of res.data) {
            let member = new Member();
            Object.assign(member, m);
            arr.push(member);
        }
        return arr;
    }

    static async getById(uid) {
        let res = await BackendController.makeRequest(`${this.url}/${uid}`);
        if (! res.success || res.data === null) return null;
        let member = new Member();
        Object.assign(member, res.data);
        return member;
    }

    async loadUserData() {
        let user = await User.getById(this.uid);
        Object.assign(this, user);
    }
}
export class Room {
    static url = "/room";
    static Tracks = Tracks;
    static Member = Member;

    roomUid;
    roomName;
    ownerUid;
    joinCode;

    static async getCurrent() {
        let res = await BackendController.makeRequest(this.url);
        console.log(res)
        if (! res.success) return null;
        let room = new Room();
        Object.assign(room, res.data);
        return room;
    }

    static async create(roomName, username) {
        return await BackendController.makeRequest(`${this.url}/create`, { roomName, username });
    }

    static async join(joinCode, username) {
        return await BackendController.makeRequest(`${this.url}/join`, { joinCode, username });
    }

    static async leave() {
        return await BackendController.makeRequest(`${this.url}/leave`);
    }

}