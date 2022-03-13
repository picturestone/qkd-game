import Channel from "../channel/Channel";
import PlayerRole from "./PlayerRole";

export default class Player<PlayerRoleType extends PlayerRole> {
    private _role: PlayerRoleType;

    constructor(role: PlayerRoleType) {
        this._role = role;
    }

    get role(): PlayerRoleType {
        return this._role;
    }
}