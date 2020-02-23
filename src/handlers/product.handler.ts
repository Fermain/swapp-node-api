import {SWAPCONNECTION} from "../common/db";
import {Product} from "../data/product";
import {IMulterFile} from "../models/user.profile.models";
import {UserProfileHandler} from "./user.profile.handler";

export class ProductHandler {
    constructor() {
    }

    public static async getUserProducts(userId: number): Promise<Product[]> {
        return SWAPCONNECTION<Product>('products')
            .where({user_id: userId, cancelled: false});
    }

    public static async getSingleUserProduct(userId: number): Promise<Product | undefined> {
        return SWAPCONNECTION<Product>('products')
            .where({user_id: userId, cancelled: false})
            .first();
    }

    public static async addProduct(userId: number, product: Product, images: IMulterFile[]) {
        const trx = await SWAPCONNECTION.transaction();
        const userProfile = await UserProfileHandler.getUserProfileByUserId(userId);
        if (!userProfile) {
            throw new Error('User profile does not exist');
        }
        const _product: any[] = await trx<Product>('products')
            .insert({
                name: product.name,
                description: product.description,
                location: product.location,
                ideal_exchange: product.ideal_exchange,
                is_available: product.is_available,
                is_free: product.is_free,
                cancelled: false,
                user_profile_id: userProfile.id
            }, ['*']);
        const productId: number = _product[0].id;
        const imageFields = images.map((img: IMulterFile) => {
            return {
                image_path: img.path,
                product_id: productId
            }
        });
        await trx('product_images').insert(imageFields, ['*']);
        await trx.commit();
        return _product;
    }
}
