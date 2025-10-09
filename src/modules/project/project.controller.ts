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


const getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await ProjectServices.getAllProjects(query as Record<string, string>);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "All projects retrieved successfully",
        data: result.data,
        meta: result.meta
    })

})



const getProjectById = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await ProjectServices.getProjectById(id)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Projects retrieved successfully",
        data: result
    })

})


const deleteProject = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const result = await ProjectServices.deleteProject(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project deleted successfully",
        data: result
    })
})


const updateProject = catchAsync(async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    const payload = req.body;
    const userId = req.user?.id;

    const result = await ProjectServices.updateProject(payload, id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Project updated successfully',
        data: result
    });
});







export const ProjectControllers = {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProject,
    updateProject
}