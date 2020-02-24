import {FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, ServerResponse} from "http";
import jwt from "jsonwebtoken";
import envSchema from "env-schema";
import {ITokenPayload} from "../models/token.payload.model";
import {AESEncryption} from "../common/encryption";

const schema = {
    type: 'object',
    required: ['JWT_SECRET_KEY'],
    properties: {
        JWT_SECRET_KEY: { type: 'string' }
    }
};
const config = envSchema({
    schema: schema,
    dotenv: true
});

export class AuthHandler {
    public static async generateAuthToken(tokenPayload: ITokenPayload) {
        const userId = AESEncryption.encrypt(tokenPayload.user_id.toString());
        return jwt.sign({
                email: tokenPayload.email_address,
                userId: userId
            }, config.JWT_SECRET_KEY, {
                issuer: "wiredmartian",
                algorithm: "HS512",
                expiresIn: "1h"
            });
    }
    public static async authInterceptor(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
        const authHeader = request.headers.authorization;
        const anonymousRoutes = ['/token', '/register'];
        const { req } = request;
        if (req.url!.match(/\w*documentation\w*\b/g)) {
            return;
        }
        try {
            for (let r of anonymousRoutes) {
                if (req.url == r) {
                    return;
                }
            }
            if (!authHeader) {
                reply.unauthorized('Request missing auth token');
            }
            let {userId, email} = await request.jwtVerify();
            userId = AESEncryption.decrypt(userId);
            (request as any).currentUser = {userId, email};
        } catch (e) {
            reply.unauthorized(e.message);
        }
    }
}
