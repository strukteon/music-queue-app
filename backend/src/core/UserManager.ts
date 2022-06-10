import {User} from "./User";
import crypto from "crypto";

export class UserManager {
    userList: Array<User>;


    constructor() {
        this.userList = [];
    }

    addUser(uid: String, username: null | String = null) {
        if (username === null) username = `Guest${String(Math.random()).substr(2, 4)}`;
        if (this.getUserByUid(uid))
            throw new Error("User already exists");
        let user = new User(uid, username);
        this.userList.push(user);
        return user;
    }

    authenticateUser(key) {
        let hash = crypto.createHash('md5').update(key).digest("hex");
        return String(parseInt(hash, 16)).substr(2, 16);
    }

    getUserByUid(uid) {
        return this.userList.find(u => u.uid === uid);
    }
}