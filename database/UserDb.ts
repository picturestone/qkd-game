import { time } from 'console';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';

export default class UserDb {
    // TODO use database instead of in-memory
    static _users = new Array<User>();
    private static _usersScheduledForDelete = new Map<string, NodeJS.Timeout>();

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

    unscheduleUserForDelete(id: string) {
        const timeout = UserDb._usersScheduledForDelete.get(id);
        if (timeout) {
            clearTimeout(timeout);
            UserDb._usersScheduledForDelete.delete(id);
        }
    }

    scheduleUserForDelete(id: string) {
        const timeout = setTimeout(() => {
            this.delete(id);
            UserDb._usersScheduledForDelete.delete(id);
        }, 60000);
        UserDb._usersScheduledForDelete.set(id, timeout);
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
