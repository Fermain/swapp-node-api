import fastifyPlugin, {nextCallback, PluginOptions} from "fastify-plugin";
import multer from "fastify-multer";
import {FastifyInstance, FastifyRequest} from "fastify";
import {ICreateUserProfile, IMulterFile} from "../models/user.profile.models";
import {UserProfileHandler} from "../handlers/user.profile.handler";
import {AESEncryption} from "../common/encryption";
import {IncomingMessage} from "http";
import {File} from "fastify-multer/lib/interfaces";
import {Helpers} from "../common/helpers";
import {uuid} from "uuidv4";

/** File upload config */
const storage = multer.diskStorage({
    destination: (req: FastifyRequest<IncomingMessage>, file: File, done) => {
        done(null, './public/avatars');
    },
    filename: (req, file, done) => {
        const fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
        const fileName = `${uuid()}.${fileExtension}`;
        done(null, fileName);
    }
});
const imageUpload = multer({
    storage: storage,
    fileFilter: (req, file, done) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.indexOf(file.mimetype) === -1) {
            done(new Error(`${file.originalname} has an invalid mime type`), false);
        }
        done(null, true);
    },
    limits: {
        fieldNameSize: 100,
        fields: 0,
        files: 1,
        headerPairs: 100
    }
});
/** File upload config */

export const userProfileController = fastifyPlugin(async (server: FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/profile",
        schema: UserProfileHandler.createUserProfileSchema.schema,
        handler: async (request, reply) => {
            try {
                const user = {...request.body} as ICreateUserProfile;
                const userId = parseInt(AESEncryption.decrypt(request.user['userId']));
                const res = await UserProfileHandler.createUserProfile(user, userId);
                if (res && res.length > 0) {
                    return reply.send({profile_id: res[0].id, success: true, message: 'user profile updated'});
                }
                return reply.code(400).send({success: false, message: 'Failed to update user profile'});
            } catch (e) {
                return reply.badRequest(e);
            }
        }
    });
    server.route({
        method: "GET",
        url: "/profile/:id",
        schema: UserProfileHandler.getUserProfileByIdSchema.schema,
        handler: async (request, reply) => {
            try {
                const user = await UserProfileHandler.getUserProfileById(parseInt(request.params.id));
                if (user) {
                    return reply.send(user);
                }
                return reply.notFound(`user ${request.params.id} does not exist`);
            } catch (e) {
                return reply.badRequest(e);
            }
        }
    });
    server.route({
        method: "PATCH",
        url: "/profile/avatar",
        schema: {
            tags: ['User Profile'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: {type: 'boolean'},
                        message: {type: 'string'}
                    }
                }
            }
        },
        preHandler: imageUpload.single('avatar'),
        handler: async (request, reply) => {
            const avi = request.file as IMulterFile;
            try {
                const userId = parseInt(AESEncryption.decrypt(request.user['userId']));
                const aviUpdated: number = await UserProfileHandler.updateUserAvatar(userId, avi.path);
                if (aviUpdated) {
                    reply.send({message: 'avatar updated!', success: true});
                } else {
                    reply.badRequest('Failed to update avatar!');
                }
            } catch (e) {
                await Helpers.removeSingleFileFromDir(avi);
                reply.internalServerError(e);
            }
        }
    });
    next();
});
