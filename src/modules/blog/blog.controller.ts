import type { Request, Response } from "express"
import { BlogServices } from "./blog.service.js"
import { sendResponse } from "../../utils/sendResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";



const createBlog = catchAsync(async (req: Request, res: Response) => {

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
})



const getAllBlogs = catchAsync(async (req: Request, res: Response) => {

    const query = req.query;
    const result = await BlogServices.getAllBlogs(query as Record<string, string>);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "All Blogs retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})



const updateBlog = catchAsync(async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    const payload = req.body;

    const result = await BlogServices.updateBlog(id, payload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Blog updated successfully',
        data: result, 
    });
})



const getBlogById = catchAsync(async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    const result = await BlogServices.getBlogById(id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Blog retrieved successfully",
        data: result.data
    })
});


const deleteBlog = catchAsync(async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    const result = await BlogServices.deleteBlog(id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Blog deleted successfully",
        data: null
    })

});



export const BlogControllers = {
    createBlog,
    getAllBlogs,
    updateBlog,
    getBlogById,
    deleteBlog
}