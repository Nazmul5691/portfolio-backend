import { Router } from "express";
import { ProjectControllers } from "./project.controller.js";
import { Role } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth.js";




const router = Router();


router.post("/create-project", checkAuth(...Object.values(Role)), ProjectControllers.createProject);
router.get("/", ProjectControllers.getAllProjects )



export const ProjectRoutes = router;