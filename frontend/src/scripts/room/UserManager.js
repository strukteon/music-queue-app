import BackendController from "@/scripts/BackendController";

export class UserManager {
    users = new Map();

    async loadUsers(userIdList = []) {
        console.log('started loading')
        await Promise.all(userIdList.map(async v => {
            let user = new User(v);
            await user.loadInfos();
            console.log('loaded user', user);
            this.users.set(user.userId, user);
        }));
        console.log('finished loading')
    }

    async loadUser(userId) {
        if (! this.users.has(userId))
            this.users.set(userId, new User(userId));
        await this.users.get(userId).loadInfos();
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    getAllUsers() {
        return Array.from(this.users.values());
    }

    removeUser(userId) {
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