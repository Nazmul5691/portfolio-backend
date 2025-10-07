import type { User } from "@prisma/client";
import { generateToken } from "./jwt.js";
import { envVars } from "../config/env.js";


export const createUserTokens = (user: Partial<User>) => {
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

    return {
        accessToken,
        refreshToken
    }
}
