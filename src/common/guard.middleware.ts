import { Request, Response, NextFunction } from 'express';
import { IMiddleWare } from './middleware.interface';

export class GuardMiddleware implements IMiddleWare {
    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.user) {
            return next();
        }
        res.status(401).send({ error: 'Вы не авторизованы' });
    }
}
