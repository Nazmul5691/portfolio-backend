/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types.js";


export const handleZodError = (error: any): TGenericErrorResponse => {

    const errorSources: TErrorSources[] = [];

    error.issues.forEach((issue: any) => {
        errorSources.push({
            // path: nicename inside lastname inside name
            // path: issue.path.length > 1 && issue.path.reverse().join(" inside ")

            path: issue.path[issue.path.length - 1],
            message: issue.message
        })
    })

    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources,
    }
}
