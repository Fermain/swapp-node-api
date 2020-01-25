import fastifyPlugin, { nextCallback, PluginOptions } from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { ServerResponse } from "http";
export const authController = fastifyPlugin(async (server:FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "GET",
        url: "/token",
        schema: {},
        handler: (request: FastifyRequest, reply:FastifyReply<ServerResponse>) => {
            reply.code(200).send({message: 'Hello world'});
        }
    });
    next();
});
