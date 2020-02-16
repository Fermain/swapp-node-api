import fastifyPlugin, {nextCallback, PluginOptions} from "fastify-plugin";
import {FastifyInstance} from "fastify";
import { userProfileSchema } from "../schemas/user.profile.schema";
import {UserHandler} from "../handlers/user.handler";
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
                let { userId } = await request.jwtVerify();
                userId = AESEncryption.decrypt(userId);
                const res = await UserProfileHandler.createUserProfile(user, parseInt(userId));
                if (res) {
                    return reply.send({success: true, message: 'user created!'});
                }
                return reply.send({success: false, message: 'Failed to create a user'});
            } catch (e) {
                return reply.badRequest(e);
            }
        }
    });
    next();
});
