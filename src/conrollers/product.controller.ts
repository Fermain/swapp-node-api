import fastifyPlugin, {nextCallback, PluginOptions} from "fastify-plugin";
import fs from "fs";
import multer from "fastify-multer";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, ServerResponse} from "http";
import {File} from "fastify-multer/lib/interfaces";
import {AESEncryption} from "../common/encryption";
import {ProductHandler} from "../handlers/product.handler";
import {Product} from "../data/product";
import {IMulterFile} from "../models/user.profile.models";
import {Helpers} from "../common/helpers";
import {uuid} from "uuidv4";

/** File upload config */
const storage = multer.diskStorage({
    destination: (request: FastifyRequest<IncomingMessage>, file: File, done) => {
        const _path = `./public/products/product-${request.params.id}`;
        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }
        done(null, `./public/products/product-${request.params.id}`);
    },
    filename: (req: FastifyRequest<IncomingMessage>, file, done) => {
        const fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
        const fileName = `${uuid()}.${fileExtension}`;
        done(null, fileName);
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
        handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
            try {
                const userId = parseInt(AESEncryption.decrypt(request.user['userId']));
                const product = {...request.body} as Product;
                const result = await ProductHandler.addProduct(userId, product);
                if (result && result.length > 0) {
                    reply.send({
                        success: true,
                        message: 'Product added successfully!',
                        product_id: result[0].id
                    })
                } else {
                    reply.code(400).send({
                        success: false,
                        message: 'Failed to add product!',
                    });
                }
            } catch (e) {
                reply.internalServerError(e);
            }
        },
    });
    server.route({
        method: "POST",
        url: "/product/:id/images",
        schema: {
            tags: ['Products'],
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'string'}
                        }
                    }
                }
            }
        },
        preHandler: imageUpload.array('productImages', 10),
        handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
            try {
                const files = request.files as IMulterFile[];
                const result = await ProductHandler.uploadProductImages(request.params.id, files);
                console.log(result);
                reply.send(result);
            } catch (e) {
                /** remove the uploaded files*/
                const files = request.files as IMulterFile[];
                await Helpers.removeFilesFromDir(files);
                reply.internalServerError(e);
            }
        }
    });
    server.route({
        method: "GET",
        url: "/products/:limit",
        schema: ProductHandler.getProductsSchema.schema,
        handler: async (request, reply) => {
            try {
                const limit = parseInt(request.params.limit);
                let result = await ProductHandler.getProducts(limit);
                reply.send(result.rows);
            } catch (e) {
                reply.badRequest(e);
            }
        }
    });
    next();
});
