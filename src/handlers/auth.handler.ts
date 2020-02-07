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

    public static async generateAuthToken(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
        try {
            const { username, password } = request.body;
            console.log(username, password);
            const token = jwt.sign({
                username: username,
            }, config.JWT_SECRET_KEY, {
                issuer: "wiredmartian",
                algorithm: "HS512",
                expiresIn: "1h"
            });
            reply.send({ token });
        } catch (e) {
            console.log(e);
            reply.unauthorized(e.message);
        }
    }
    public static async authInterceptor(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
        const authHeader = request.headers.authorization;
        const anonymousRoutes = ['token'];
        const { req } = request;
        if (req.url!.match(/\w*documentation\w*\b/g)) {
            return;
        }
        try {
            if (req.url!.includes(anonymousRoutes[0])) {
                return;
            }
            if (!authHeader) {
                reply.forbidden('Request missing auth token');
            }
            await request.jwtVerify();
        } catch (e) {
            reply.unauthorized(e.message);
        }
    }
}
