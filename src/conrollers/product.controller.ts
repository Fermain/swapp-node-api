import fastifyPlugin, {nextCallback, PluginOptions} from "fastify-plugin";
import fs from "fs";
import multer from "fastify-multer";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, ServerResponse} from "http";
import {File} from "fastify-multer/lib/interfaces";
import {AESEncryption} from "../common/encryption";
import {IMulterFile} from "../models/user.profile.models";
import {ProductHandler} from "../handlers/product.handler";
import {Product} from "../data/product";
import {Helpers} from "../common/helpers";

/** File upload config */
const storage = multer.diskStorage({
    destination: (req: FastifyRequest<IncomingMessage>, file: File, callback) => {
        const _user = (req as any).currentUser;
        const _path = `./public/products/${_user.userId}`;
        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }
        callback(null, `./public/products/${_user.userId}`);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});
const imageUpload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.indexOf(file.mimetype) === -1) {
            callback(new Error(`${file.originalname} has an invalid mime type`), false);
        }
        callback(null, true);
    },
    limits: {
        fieldNameSize: 100,
        fields: 8,
        files: 5,
        fieldSize: 1024
    }
});
/** File upload config */

export const productController = fastifyPlugin(async (server: FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/product",
        schema: ProductHandler.addProductSchema.schema,
        preHandler: imageUpload.array('productImages', 10),
        handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
            try {
                const userId = parseInt(AESEncryption.decrypt(request.user['userId']));
                const images = request.files as IMulterFile[];
                const product = {...request.body} as Product;
                const result = await ProductHandler.addProduct(userId, product, images);
                reply.send(result[0]);
            } catch (e) {
                /** remove the uploaded files*/
                const files = request.files as IMulterFile[];
                await Helpers.removeFilesFromDir(files);
                reply.internalServerError(e);
            }
        },
    });
    next();
});
