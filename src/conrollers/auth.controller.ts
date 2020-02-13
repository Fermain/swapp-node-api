import fastifyPlugin, { nextCallback, PluginOptions } from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { AuthHandler } from "../handlers/auth.handler";
import { authSchema } from "../schemas/auth.schema";
import {UserHandler} from "../handlers/user.handler";
export const authController = fastifyPlugin(async (server:FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/register",
        schema: {},
        preHandler: (request, reply) => {

        },
        handler: (request, reply) => {

        }
    });
    server.route({
        method: "POST",
        url: "/token",
        schema: authSchema.getToken.schema,
        preHandler: async (request, reply) => {
            try {
                const user = await UserHandler.loginUser({...request.body});
                if (!user.success && user.error) {
                    return reply.unauthorized(user.error);
                }
                request.user = user;
            } catch (e) {
                return reply.badRequest(e);
            }
        },
        handler: (request, reply) => {
            try {
                const token = AuthHandler.generateAuthToken(request.user.email_address);
                return reply.send({ token });
            } catch (e) {
                return reply.forbidden(e);
            }
        }
    });
    next();
});
