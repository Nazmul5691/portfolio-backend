import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { ProjectServices } from "./project.service.js";
import { sendResponse } from "../../utils/sendResponse.js";




// credentials Login
const createProject = catchAsync(async (req: Request, res: Response) => {
    

    if (!req.user?.id) {
        return sendResponse(res, {
            statusCode: 401,
            success: true,
            message: "Unauthorized . Please login first to create a project",
            data: null
        })
    };

    const payload = {
        ...req.body,
        ownerId: Number(req.user?.id)
    }

    const result = await ProjectServices.createProject(payload);


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project created successfully",
        data: result
    })
});







export const ProjectControllers = {
    createProject
}