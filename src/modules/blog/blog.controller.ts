import type { Request, Response } from "express"
import { BlogServices } from "./blog.service.js"
import { sendResponse } from "../../utils/sendResponse.js";

const createBlog = async (req: Request, res: Response) => {

    if (!req.user?.id) {
        return sendResponse(res, {
            statusCode: 401,
            success: true,
            message: "Unauthorized . Please login first to create a blog",
            data: null
        })
    };

    const payload = {
        ...req.body,
        authorId: Number(req.user.id)
    }


    const result = await BlogServices.createBlog(payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Blog created successfully",
        data: result
    })
}



export const BlogControllers = {
    createBlog
}