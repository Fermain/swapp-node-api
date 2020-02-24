import fastifyPlugin, {nextCallback, PluginOptions} from "fastify-plugin";
import multer from "fastify-multer";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, ServerResponse} from "http";
import {File} from "fastify-multer/lib/interfaces";
import {AESEncryption} from "../common/encryption";
import {IMulterFile} from "../models/user.profile.models";
import {ProductHandler} from "../handlers/product.handler";
import {Product} from "../data/product";

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
        fields: 8,
        files: 5,
        headerPairs: 100
    }
});
/** File upload config */

export const productController = fastifyPlugin(async (server: FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/product",
        schema: {
            tags: ['Products']
        },
        preHandler: imageUpload.array('productImages', 10),
        handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
            console.log('decorate request');
            console.log((request as any).currentUser);
            console.log('------------------------');
            try {
                let {userId} = await request.jwtVerify();
                userId = AESEncryption.decrypt(userId);
                const images = request.files as IMulterFile[];
                const product = {...request.body} as Product;
                const result = await ProductHandler.addProduct(userId, product, images);
                reply.send(result[0]);
            } catch (e) {
                reply.internalServerError(e);
            }
        }
    });
    next();
});
