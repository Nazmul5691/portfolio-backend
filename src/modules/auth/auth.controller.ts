import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { AuthServices } from "./auth.service.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";



// credentials Login
const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    const { accessToken, refreshToken, user } = loginInfo;

    setAuthCookie(res, { accessToken, refreshToken });

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User logged in successfully',
        data: {
            accessToken,
            refreshToken,
            user
        }
    });
});




const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User logged out successfully',
        data: null
    })
})




export const AuthControllers = {
    credentialsLogin,
    logout
}