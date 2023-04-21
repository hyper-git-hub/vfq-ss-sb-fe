export interface ApiResponse {
    status: number;
    error?: string,
    message: string,
    err?: string,
    data?: any
}