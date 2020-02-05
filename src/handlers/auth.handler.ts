import { LoginModel } from "../models/account.models";
import { FastifyReply, FastifyRequest } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

export class AuthHandler {

    public async generateAuthToken(model: LoginModel): Promise<string> {
        return 'token';
    }
    public static async authInterceptor(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
        const token = request.headers.authorization;
        try {
            if (!token) {
                reply.forbidden('Request missing auth token');
            }
            await request.jwtVerify();
        } catch (e) {
            reply.unauthorized(e.message);
        }
    }
}
