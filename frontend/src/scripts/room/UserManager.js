import BackendController from "@/scripts/BackendController";

export class UserManager {
    static users = new Map();

    static async loadUsers(userIdList = []) {
        console.log('started loading')
        await Promise.all(userIdList.map(async v => {
            let user = new User(v);
            await user.loadInfos();
            console.log('loaded user', user);
            this.users.set(user.userId, user);
        }));
        console.log('finished loading')
    }

    static async loadUser(userId) {
        if (! this.users.has(userId))
            this.users.set(userId, new User(userId));
        await this.users.get(userId).loadInfos();
    }

    static getUser(userId) {
        return this.users.get(userId);
    }

    static getAllUsers() {
        return Array.from(this.users.values());
    }

    static removeUser(userId) {
        this.users.delete(userId);
    }
}

export class User {
    userId = null;
    isAdmin = null;
    username = null;


    constructor(userId, isAdmin = false) {
        this.userId = userId;
        this.isAdmin = isAdmin;
    }

    async loadInfos() {
        let response = await BackendController.getUser(this.userId);
        if (! response.success) throw new Error("an error occured while loading user: ", response);
        this.username = response.data.username;
    }
}