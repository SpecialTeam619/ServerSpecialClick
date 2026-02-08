import { NextFunction, Request, Response } from 'express';

export interface IPostsController {
    create: (req: Request, res: Response, next: NextFunction) => void;
    info: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
