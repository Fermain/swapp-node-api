export interface User {
    id: number;
    email_address: string;
    salt: string;
    hashed_password: string;
    created_at: Date;
    last_signed_in: Date
}
