import type { NextFunction, Request, Response } from "express"


type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
        // if (envVars.NODE_ENV === 'development') {
        //     console.log(error);
        // }
        next(error)
    })
}
