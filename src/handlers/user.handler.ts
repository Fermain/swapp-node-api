import { swappdb } from "../common/db";
import {createHmac, randomBytes} from "crypto"
import {ICreateUser} from "../models/account.models";

export class UserHandler {
    constructor() {
    }
    public async insertUser(user: ICreateUser) {
        const salt = randomBytes(Math.ceil(8)).toString('hex').slice(0, 16);
        const hashPassword = createHmac('sha512', salt);
        hashPassword.update(user.password);
        return swappdb('users').insert({
            first_name: user.first_name,
            email_address: user.email_address,
            salt: salt,
            hashed_password: hashPassword
        });
    }
}
