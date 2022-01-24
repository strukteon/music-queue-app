import {Room} from "@/scripts/models/Room";

export class MemberManager {
    static members = new Map();

    static async loadAllMembers() {
        let members = await Room.Member.getAll();
        if (members === null) return;

        await Promise.all(members.map(async m => {
            await m.loadUserData();
            this.members.set(m.uid, m);
        }));
        console.log('finished loading')
    }

    static async loadMember(userId) {
        if (! this.members.has(userId))
            this.members.set(userId, await Room.Member.getById(userId));
        await this.members.get(userId).loadUserData();
    }

    static getMember(userId) {
        return this.members.get(userId);
    }

    static getAllMembers() {
        return Array.from(this.members.values());
    }

    static removeMember(userId) {
        this.members.delete(userId);
    }
}