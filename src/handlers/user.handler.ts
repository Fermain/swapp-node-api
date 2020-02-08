import { swappdb } from "../common/db";

export class UserHandler {
    constructor() {
    }
    public async insertUser() {
        const result = swappdb('users').insert({

        })
    }
}
