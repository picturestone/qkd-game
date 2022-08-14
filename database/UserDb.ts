import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';

export default class UserDb {
    // TODO use database instead of in-memory
    static _users = new Array<User>();

    create(user: User) {
        return new Promise<User>((res) => {
            user.id = uuidv4();
            UserDb._users.push(user);
            res(user);
        });
    }

    findById(id: string) {
        return new Promise<User | undefined>((res) => {
            const user = UserDb._users.find((user) => user.id === id);
            res(user);
        });
    }

    delete(id: string) {
        return new Promise<User | undefined>((res) => {
            const index = UserDb._users.findIndex((user) => user.id === id);
            const removedUsers = UserDb._users.splice(index, 1);
            let retVal: User | undefined = undefined;
            if (removedUsers.length > 0) {
                retVal = removedUsers[0];
            }
            res(retVal);
        });
    }
}
