import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { UserServices } from "./user.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";


//create user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'User successfully created',
        data: user
    })
})







const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload
    
    const result = await UserServices.getMe(Number(decodedToken.id));

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Your profile retrieved successfully",
        data: result.data,
    });
})



// get user by id
const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const result = await UserServices.getUserById(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "User retrieved successfully",
        data: result.data
    })
})



export const UserControllers = {
    createUser,
    getUserById,
    getMe
}