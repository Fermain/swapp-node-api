export interface LoginModel {
    email_address: string;
    password: string;
}
export interface ICreateUser {
    full_name: string;
    email_address: string;
    password: string;
    created_at: Date,
    last_signed_in: Date
}
