import fastifyPlugin, {nextCallback, PluginOptions} from "fastify-plugin";
import {FastifyInstance} from "fastify";
import {userProfileSchema} from "../schemas/user.profile.schema";
import {ICreateUserProfile} from "../models/user.profile.models";
import {UserProfileHandler} from "../handlers/user.profile.handler";
import {AESEncryption} from "../common/encryption";

export const userProfileController = fastifyPlugin(async (server:FastifyInstance, options: PluginOptions, next: nextCallback) => {
    server.route({
        method: "POST",
        url: "/profile",
        schema: userProfileSchema.createProfile.schema,
        handler: async (request, reply) => {
            try {
                const user = {...request.body} as ICreateUserProfile;
                let {userId} = await request.jwtVerify();
                userId = AESEncryption.decrypt(userId);
                const res = await UserProfileHandler.createUserProfile(user, parseInt(userId));
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
        schema: userProfileSchema.getUserProfile.schema,
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
    next();
});
