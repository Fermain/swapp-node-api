import {SWAPCONNECTION} from "../common/db";
import {Product} from "../data/product";

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
}
