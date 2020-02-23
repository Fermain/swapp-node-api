import fastifyPlugin, {nextCallback, PluginOptions} from "fastify-plugin";
import multer from "fastify-multer";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, ServerResponse} from "http";
import {File} from "fastify-multer/lib/interfaces";

/** File upload config */
const storage = multer.diskStorage({
    destination: (req: FastifyRequest<IncomingMessage>, file: File, callback) => {
        callback(null, './public/products');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});
const imageUpload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        callback(null, true);
    },
    limits: {
        fieldNameSize: 100,
        fields: 0,
        files: 10,
        headerPairs: 100
    }
});
/** File upload config */

export const productController = fastifyPlugin(async (server: FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/product",
        schema: {},
        handler: (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {

        }
    });
    next();
});
