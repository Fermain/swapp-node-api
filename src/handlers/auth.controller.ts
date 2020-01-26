import {LoginModel} from "../models/account.models";

export class AuthController {
    constructor() {
    }

    public async getAuthToken(model: LoginModel): Promise<string> {
        return 'token';
    }
}
