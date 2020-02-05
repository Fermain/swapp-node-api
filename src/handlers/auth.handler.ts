import {LoginModel} from "../models/account.models";
import {FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, ServerResponse} from "http";
import { sign } from "jsonwebtoken";

export class AuthHandler {

    public async generateAuthToken(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
        try {
            const { username, password } = request.body as LoginModel;
            const token = sign({
                username: username,
            }, '', {
                algorithm: "ES512",
                issuer: "swap api",
                expiresIn: "1h"
            });
            reply.send(token);
        } catch (e) {
            reply.unauthorized(e.message);
        }
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
