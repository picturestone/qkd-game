import { v4 as uuidv4 } from 'uuid';
import User from "../models/User";

export default class UserDb {
    // TODO use database instead of in-memory
    static _users = new Array<User>();

    create(user: User) {
        return new Promise<User>((res) => {
            user.setId(uuidv4());
            UserDb._users.push(user);
            res(user);
        });
    }

    findById(id: string) {
        return new Promise<User | undefined>((res) => {
            const user = UserDb._users.find(user => user.getId() === id);
            res(user);
        });
    }
}