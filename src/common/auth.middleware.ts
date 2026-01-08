import { Request, Response, NextFunction } from 'express';
import { IMiddleWare } from './middleware.interface';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleWare {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.headers.authorization) {
            // Bearer JWT
            const token = req.headers.authorization.split(' ')[1];
            verify(token, this.secret, function (err, decoded) {
                if (err) {
                    next();
                } else if (
                    decoded &&
                    typeof decoded === 'object' &&
                    'email' in decoded
                ) {
                    req.user = (decoded as { email: string }).email;

                    next();
                }
            });
        } else {
            next();
        }
    }
}
