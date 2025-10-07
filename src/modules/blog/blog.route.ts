import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createBlogZodSchema } from "./blog.validation.js";
import { BlogControllers } from "./blog.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "@prisma/client";


const router = Router();


router.post("/create-blog", checkAuth(...Object.values(Role)),validateRequest(createBlogZodSchema), BlogControllers.createBlog);


export const BlogRoutes = router;
