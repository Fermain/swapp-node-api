export interface LoginModel {
    username: string;
    password: string;
}
export interface ICreateUser {
    first_name: string;
    email_address: string;
    password: string;
    created_at: Date,
    last_signed_in: Date
}
