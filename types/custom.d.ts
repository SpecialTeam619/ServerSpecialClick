declare namespace Express {
    export interface Request {
        user?: string
        file?: File
    }
}