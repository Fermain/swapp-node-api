import fastifyPlugin, { nextCallback, PluginOptions } from "fastify-plugin";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { AuthHandler } from "../handlers/auth.handler";
import { authSchema } from "../schemas/auth.schema";
import {UserHandler} from "../handlers/user.handler";
import {ICreateUser} from "../models/account.models";
import {IncomingMessage, ServerResponse} from "http";
export const authController = fastifyPlugin(async (server:FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/register",
        schema: authSchema.registerUser.schema,
        handler: async (request, reply) => {
            const user = {...request.body} as ICreateUser;
            try {
                const res = await UserHandler.createUser(user);
                if (res) {
                    return reply.send({ success: true, message: 'user created!'});
                }
                /** needs an appropriate message here */
                return reply.send({ success: false, message: 'Failed to create a user'});
            } catch (e) {
                return reply.badRequest(e);
            }
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
        handler: async (request:FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
            try {
                const token = await AuthHandler.generateAuthToken((request.user as any).email_address);
                return reply.send({ token });
            } catch (e) {
                return reply.forbidden(e);
            }
        }
    });
    next();
});
