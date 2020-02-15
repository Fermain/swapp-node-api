import {FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, ServerResponse} from "http";
import jwt from "jsonwebtoken";
import envSchema from "env-schema";

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
    public static async generateAuthToken(email_address: string) {
        return jwt.sign({
                email: email_address,
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
            await request.jwtVerify();
        } catch (e) {
            reply.unauthorized(e.message);
        }
    }
}
