export interface Product {
    id: number;
    name: string;
    description: string;
    location: string;
    ideal_exchange?: string;
    is_available: boolean;
    is_free: boolean;
    created_at: Date,
    cancelled: boolean;
}
