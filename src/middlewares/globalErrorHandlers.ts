import type { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env.js";
import type { TErrorSources } from "../interfaces/error.types.js";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "../helpers/handlePrismaError.js";
import { handleZodError } from "../helpers/handleZodError.js";
import AppError from "../errorHelpers/appError.js";


/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler = async (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (envVars.NODE_ENV === "development") {
        console.log(error);
    }


    let statusCode = 500;
    let message = "Something Went Wrong!!";
    let errorSources: TErrorSources[] = [];


    // Prisma errors
    if (error?.code?.startsWith("P") || error instanceof Prisma.PrismaClientValidationError) {
        const simplifiedError = handlePrismaError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }


    // Zod validation error
    else if (error.name === "ZodError") {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    }


    // Custom AppError
    else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }


    // Generic JS Error
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }


    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === "development" ? error : null,
        stack: envVars.NODE_ENV === "development" ? error.stack : null,
    });
};
