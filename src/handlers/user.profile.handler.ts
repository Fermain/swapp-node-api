import {SWAPCONNECTION} from "../common/db";
import {ICreateUserProfile} from "../models/user.profile.models";
import {UserProfile} from "../data/user_profile";

export class UserProfileHandler {
    public static async createUserProfile(profile: ICreateUserProfile, userId: number): Promise<any[]> {
        const userProfile = await this.getUserProfileByUserId(userId);
        if (!userProfile) {
            return SWAPCONNECTION('user_profiles').insert({
                first_name: profile.first_name,
                last_name: profile.last_name,
                current_city: profile.current_city,
                province: profile.province,
                bio: profile.bio,
                user_id: userId
            }, ['id']);
        } else {
            return SWAPCONNECTION('user_profiles')
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
        return SWAPCONNECTION<UserProfile>('user_profiles').select('*')
            .where({user_id: userId}).first();
    }

    public static async getUserProfileById(id: number) {
        return SWAPCONNECTION<UserProfile>('user_profiles').select('*')
            .where({id}).first();
    }

    public static async updateUserAvatar(id: number, imagePath: string) {
        return SWAPCONNECTION('user_profiles')
            .where({id}).first()
            .update({photo: imagePath});
    }
}
