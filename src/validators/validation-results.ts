import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const checkValidationResults = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400)
            .send({
                errorsMessages: errors
                    .array({onlyFirstError: true})
                    .map((err) => {
                        return {message: err.msg, field: (err as any).param}
                    }),
            })
        return
    }
    else {
        next()
    }
}