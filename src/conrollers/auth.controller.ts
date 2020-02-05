import fastifyPlugin, { nextCallback, PluginOptions } from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { AuthHandler } from "../handlers/auth.handler";
import { authSchema } from "../schemas/auth.schema";
export const authController = fastifyPlugin(async (server:FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/token",
        schema: authSchema.getToken.schema,
        handler: AuthHandler.generateAuthToken
    });
    next();
});
