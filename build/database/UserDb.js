"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class UserDb {
    create(user) {
        return new Promise((res) => {
            user.id = (0, uuid_1.v4)();
            UserDb._users.push(user);
            res(user);
        });
    }
    findById(id) {
        return new Promise((res) => {
            const user = UserDb._users.find((user) => user.id === id);
            res(user);
        });
    }
}
exports.default = UserDb;
// TODO use database instead of in-memory
UserDb._users = new Array();
