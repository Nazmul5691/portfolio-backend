import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createUserZodSchema } from "./user.validation.js";
import { UserControllers } from "./user.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "@prisma/client";



const router = Router();


// /api/v1/user
router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get("/:id", checkAuth(Role.Admin), UserControllers.getUserById);




export const UserRoutes = router;