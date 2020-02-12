import { swappdb } from "../common/db";
import {createHmac, randomBytes} from "crypto"
import {ICreateUser, LoginModel} from "../models/account.models";

export class UserHandler {
    public static async insertUser(user: ICreateUser) {
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
    public static async loginUser(login: LoginModel) {
        const user = await swappdb('users').select('*')
            .where({ email_address: login.email_address })
            .first();
        if (user) {
            const hashedPassword = createHmac('sha512', user.salt);
            hashedPassword.update(login.password);
            if (user.hashed_password === hashedPassword) {
                return {...user, success: true };
            }
            return {
                error: 'Incorrect email address or password',
                success: false;
            }
        }
        return { error: 'user does not exist', success: false };
    }
}
