import {swappDB} from "../common/db";
import {ICreateUserProfile} from "../models/user.profile.models";
import {UserProfile} from "../data/user_profile";

export class UserProfileHandler {
    public static createUserProfileSchema = {
        schema: {
            tags: ['User Profile'],
            body: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    first_name: {type: 'string'},
                    last_name: {type: 'string'},
                    current_city: {type: 'string'},
                    province: {type: 'string'},
                    bio: {type: 'string'},
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: {type: 'boolean'},
                        message: {type: 'string'},
                        profile_id: {type: 'number'}
                    }
                },
                '4xx': {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'integer'},
                        error: {type: 'string'},
                        message: {type: 'string'},
                    },
                },
            },
        }

    };

    public static async createUserProfile(profile: ICreateUserProfile, userId: number): Promise<any[]> {
        const userProfile = await this.getUserProfileByUserId(userId);
        if (!userProfile) {
            return swappDB('user_profiles').insert({
                first_name: profile.first_name,
                last_name: profile.last_name,
                current_city: profile.current_city,
                province: profile.province,
                bio: profile.bio,
                user_id: userId
            }, ['id']);
        } else {
            return swappDB('user_profiles')
                .where({user_id: userId}).first()
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    current_city: profile.current_city,
                    province: profile.province,
                    bio: profile.bio,
                }, ['id']);
        }
    }

    public static async getUserProfileByUserId(userId: number) {
        return swappDB<UserProfile>('user_profiles').select('*')
            .where({user_id: userId}).first();
    }

    public static getUserProfileByIdSchema = {
        schema: {
            tags: ['User Profile'],
            params: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    id: {type: 'number'}
                },
                required: ['id']
            },
            '4xx': {
                type: 'object',
                properties: {
                    statusCode: {type: 'integer'},
                    error: {type: 'string'},
                    message: {type: 'string'},
                },
            }
        }
    };

    public static async getUserProfileById(id: number) {
        return swappDB<UserProfile>('user_profiles').select('*')
            .where({id}).first();
    }

    public static async updateUserAvatar(id: number, imagePath: string) {
        return swappDB('user_profiles')
            .where({user_id: id}).first()
            .update({photo: imagePath});
    }
}
