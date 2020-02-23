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
        const trx = await SWAPCONNECTION.transaction();
        try {
            const _product: any[] = await trx<Product>('products')
                .insert({
                    name: product.name,
                    description: product.description,
                    location: product.location,
                    ideal_exchange: product.ideal_exchange,
                    is_available: product.is_available,
                    is_free: product.is_free,
                    cancelled: false
                }, ['*']);
            if (_product.length > 0) {
                const productId: number = _product[0].id;
                const imageFields = images.map((img: IMulterFile) => {
                    return {
                        image_path: img.path,
                        product_id: productId
                    }
                });
                const _images = await trx('product_images')
                    .insert(imageFields, ['*']);
                if (_images.length > 0) {
                    await trx.commit();
                    return _product;
                }
                return new Error('Failed to save product images');
            }
            return new Error('Failed to save product');
        } catch (e) {
            await trx.rollback(e);
            return new Error(e);
        }
    }
}
