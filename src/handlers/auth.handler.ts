import {LoginModel} from "../models/account.models";

export class AuthHandler {
    constructor() {
    }

    public async getAuthToken(model: LoginModel): Promise<string> {
        return 'token';
    }
}
