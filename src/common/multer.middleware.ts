import { Request, Response, NextFunction } from 'express';
import { IMiddleWare } from './middleware.interface';
import multer from 'multer';

export class MulterMiddleware implements IMiddleWare {
    private upload = multer({ dest: './uploads/tmp' });

    execute(req: Request, res: Response, next: NextFunction): void {
        const singleUpload = this.upload.single('avatar');

        singleUpload(req, res, (err) => {
            if (err) {
                return next(err);
            }
            if (typeof req.body.data !== 'undefined') {
                req.body = JSON.parse(req.body.data); // при отправке multipart, body становится объектом со всеми объектоми переданными в multipart, чтобы избежать ошибок заменяю req.body.data на req.body
                next();
            } else {
                 res.status(400).send({ error: 'При отправке данных в виде multipart требуется обертывать данные в data' });
            }
        });
    }
}
