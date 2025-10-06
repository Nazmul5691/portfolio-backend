import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { AuthRoutes } from "../modules/auth/auth.route.js";

export const router = Router();


const modulesRoutes = [
    {
        path:"/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    }
]



modulesRoutes.forEach((route) =>{
    router.use(route.path, route.route)
})