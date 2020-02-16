import { SWAPCONNECTION } from "../common/db";
import { ICreateUserProfile } from "../models/user.profile.models";
import {UserProfile} from "../data/user_profile";
export class UserProfileHandler {
    public static async createUserProfile(profile: ICreateUserProfile, userId: number) {
        const userProfile = await this.getUserProfileByUserId(userId);
        if (!userProfile) {
            return SWAPCONNECTION('user_profiles').insert({
                first_name: profile.first_name,
                last_name: profile.last_name,
                current_city: profile.current_city,
                province: profile.province,
                bio: profile.bio,
                user_id: userId
            });
        } else {
            return SWAPCONNECTION('user_profiles').update({
                first_name: profile.first_name,
                last_name: profile.last_name,
                current_city: profile.current_city,
                province: profile.province,
                bio: profile.bio,
            }).first();
        }
    }

    public static async getUserProfileByUserId(userId: number){
        return SWAPCONNECTION<UserProfile>('user_profiles').select('*')
            .where({ user_id: userId}).first();
    }
}
