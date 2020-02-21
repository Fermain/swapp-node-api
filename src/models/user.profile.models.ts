export interface ICreateUserProfile {
    first_name: string;
    last_name: string;
    current_city?: string;
    province?: string;
    bio?: string;
}

export interface IMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string; // 7bit
    destination: string;
    filename: string;
    path: string;
    size: number;
}
