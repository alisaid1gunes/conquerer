export interface ApiResponseType<T> {
    success: boolean;
    message: string;
    error?: string;
    data?: T;
}
