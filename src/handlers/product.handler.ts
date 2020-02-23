import {SWAPCONNECTION} from "../common/db";
import {Product} from "../data/product";
import {IMulterFile} from "../models/user.profile.models";

export class ProductHandler {
    constructor() {
    }

    public async getUserProducts(userId: number): Promise<Product[]> {
        return SWAPCONNECTION<Product>('products')
            .where({user_id: userId, cancelled: false});
    }

    public async getSingleUserProduct(userId: number): Promise<Product | undefined> {
        return SWAPCONNECTION<Product>('products')
            .where({user_id: userId, cancelled: false})
            .first();
    }

    public async addProduct(profileId: number, product: Product, images: IMulterFile[]) {

    }

    private async storeProductImages(productId: number, images: IMulterFile[]) {
        const imageFields = images.map((img: IMulterFile) => {
            return {
                image_path: img.path,
                product_id: productId
            }
        });
        return SWAPCONNECTION.insert(imageFields, ['*']);
    }
}
