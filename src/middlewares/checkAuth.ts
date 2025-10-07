
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errorHelpers/appError.js';
import { verifyToken } from '../utils/jwt.js';
import { envVars } from '../config/env.js';
import type { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../config/db.js';



export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        // const accessToken =  req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(403, "No token received");
        };

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExit = await prisma.user.findUnique({
            where: {
                email: verifiedToken.email
            }
        });

        if (!isUserExit) {
            throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist")
        };


        // if (!isUserExit.isVerified) {
        //     throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
        // }
        // if (isUserExit.isActive === IsActive.BLOCKED || isUserExit.isActive === IsActive.INACTIVE) {
        //     throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExit.isActive}`)
        // }
        // if (isUserExit.isDeleted) {
        //     throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        // }



        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!");
        };

        // console.log('token', verifiedToken);
        req.user = verifiedToken;
        next()

        // console.log("accessToken raw:", accessToken);
        // console.log("verifiedToken:", verifiedToken);

    } catch (error) {
        next(error)
    };

};




