import { Prisma } from "@prisma/client";

interface ISimplifiedError {
    statusCode: number;
    message: string;
}

export const handlePrismaError = (error: any): ISimplifiedError => {
    
    // Duplicate key error (unique constraint)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        // Check if target exists and is an array of strings
        const fields = Array.isArray(error.meta?.target)
            ? (error.meta.target as string[]).join(", ")
            : "unknown field";

        return {
            statusCode: 400,
            message: `Duplicate value found for unique field(s): ${fields}`,
        };
    }

    // Record not found error
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return {
            statusCode: 404,
            message: "Record not found",
        };
    }

    // Other PrismaClientKnownRequestError
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
            statusCode: 400,
            message: error.message,
        };
    }

    // Prisma validation error (client-side)
    if (error instanceof Prisma.PrismaClientValidationError) {
        return {
            statusCode: 400,
            message: error.message,
        };
    }

    // Fallback for unknown errors
    return {
        statusCode: 500,
        message: "Prisma unknown error",
    };
};
