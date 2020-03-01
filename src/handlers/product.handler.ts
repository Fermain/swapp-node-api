import {swappDB} from "../common/db";
import {Product} from "../data/product";
import {IMulterFile} from "../models/user.profile.models";
import {UserProfileHandler} from "./user.profile.handler";
import {uuid} from "uuidv4";

export class ProductHandler {
    constructor() {
    }

    public static async getUserProducts(userId: number): Promise<Product[]> {
        return swappDB<Product>('products')
            .where({user_id: userId, cancelled: false});
    }

    public static async getSingleUserProduct(userId: number): Promise<Product | undefined> {
        return swappDB<Product>('products')
            .where({user_id: userId, cancelled: false})
            .first();
    }

    public static addProductSchema = {
        schema: {
            tags: ['Products'],
            body: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    description: {type: 'string'},
                    location: {type: 'string'},
                    ideal_exchange: {type: 'string'},
                    is_available: {type: 'boolean', default: false},
                    is_free: {type: 'boolean', default: false},
                    category: {type: 'string'},
                },
                required: ['name', 'description', 'location', 'ideal_exchange', 'category']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: {type: 'boolean'},
                        message: {type: 'string'},
                        product_id: {type: 'number'}
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

    public static async addProduct(userId: number, product: Product) {
        const userProfile = await UserProfileHandler.getUserProfileByUserId(userId);
        if (!userProfile) {
            throw new Error('User profile does not exist');
        }
        return swappDB('products')
            .insert({
                name: product.name,
                description: product.description,
                category: product.category,
                location: product.location,
                ideal_exchange: product.ideal_exchange,
                is_available: product.is_available,
                is_free: product.is_free,
                cancelled: false,
                user_profile_id: userProfile.id
            }, ['*']);
    }

    public static async uploadProductImages(productId: number, files: IMulterFile[]) {
        const product = await this._getProductById(productId);
        if (!product) {
            throw new Error('Product does not exist');
        }
        const imageFields = files.map((img: IMulterFile) => {
            return {
                id: uuid(),
                image_path: img.path,
                product_id: productId
            }
        });
        return swappDB('product_images').insert(imageFields, ['id']);
    }

    /** private functions */
    private static async _getProductById(productId: number) {
        return swappDB<Product>('products')
            .select('id').where({id: productId, cancelled: false})
            .first();
    }
}
