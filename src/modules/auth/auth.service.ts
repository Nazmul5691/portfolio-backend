import type { User } from "@prisma/client";
import { prisma } from "../../config/db.js";
import AppError from "../../errorHelpers/appError.js";
import { StatusCodes } from "http-status-codes";
import bcryptjs from 'bcryptjs';
import { createUserTokens } from "../../utils/userTokens.js";




const credentialsLogin = async (payload: Partial<User>) => {

    const { email, password } = payload;

    if (!email) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
    }

    const isUserExit = await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            blogs: true,
            projects: true,
            skills: true,
            experiences: true,
        },
    });

    if (!isUserExit) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExit.password as string);

    if (!isPasswordMatch) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password")
    }


    const userTokens = createUserTokens(isUserExit);

    // delete isUserExit.password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExit;

    return {
        // email: isUserExit.email
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}



export const AuthServices = {
    credentialsLogin
}