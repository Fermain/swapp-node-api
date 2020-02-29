import {swappDB} from "../common/db";
import {createHmac, randomBytes} from "crypto"
import {ICreateUser, LoginModel} from "../models/account.models";
import {User} from "../data/user";

export class UserHandler {
    public static createUserSchema = {
        schema: {
            tags: ['Authentication'],
            body: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    email_address: {type: 'string'},
                    password: {type: 'string', minLength: 8, maxLength: 16}
                },
                required: ['email_address', 'password']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: {type: 'boolean'},
                        message: {type: 'string'}
                    }
                },
                '4xx': {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'integer'},
                        error: {type: 'string'},
                        message: {type: 'string'},
                    },
                }
            },
        }
    };

    public static async createUser(user: ICreateUser) {
        const salt = randomBytes(Math.ceil(8)).toString('hex').slice(0, 16);
        const hashPassword = createHmac('sha512', salt);
        hashPassword.update(user.password);
        return swappDB('users').insert({
            email_address: user.email_address,
            salt: salt,
            hashed_password: hashPassword.digest('hex'),
            last_signed_in: new Date()
        });
    }

    /** This schema defines the token, on success login */
    public static loginUserSchema = {
        schema: {
            tags: ['Authentication'],
            body: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    email_address: {type: 'string'},
                    password: {type: 'string'},
                },
                required: ['email_address', 'password'],
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: {type: 'string'}
                    }
                },
                '4xx': {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'integer'},
                        error: {type: 'string'},
                        message: {type: 'string'},
                    },
                },
            },
        }

    };

    public static async loginUser(login: LoginModel) {
        const user = await swappDB<User>('users').select('*')
            .where({email_address: login.email_address})
            .first();
        if (user) {
            const hashedPassword = createHmac('sha512', user.salt);
            hashedPassword.update(login.password);
            if (user.hashed_password === hashedPassword.digest('hex')) {
                return {...user, success: true};
            }
            return {
                error: 'Incorrect email address or password',
                success: false
            }
        }
        return { error: 'user does not exist', success: false };
    }
}
