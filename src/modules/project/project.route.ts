import { Router } from "express";
import { ProjectControllers } from "./project.controller.js";
import { Role } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { catchAsync } from "../../utils/catchAsync.js";




const router = Router();


router.post("/create-project", checkAuth(...Object.values(Role)), ProjectControllers.createProject);
router.get("/", ProjectControllers.getAllProjects );
router.get("/:id", ProjectControllers.getProjectById);
router.delete("/:id", checkAuth(...Object.values(Role)), ProjectControllers.deleteProject);
router.patch("/:id", checkAuth(...Object.values(Role)), ProjectControllers.updateProject);



export const ProjectRoutes = router;