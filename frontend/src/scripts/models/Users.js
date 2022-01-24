import BackendController from "@/scripts/BackendController";

export class User {
    static url = "/users";

    uid;
    username;

    static async getById(uid) {
        let res = await BackendController.makeRequest(`${this.url}/${uid}`);
        if (!res.success || res.data == null) return null;
        let user = new User();
        Object.assign(user, res.data);
        return user;
    }

    static async getSelf() {
        return await this.getById("@me");
    }
}