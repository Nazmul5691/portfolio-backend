import type { Prisma, Project } from "@prisma/client"
import { prisma } from "../../config/db.js"





const createProject = async (payload: Prisma.ProjectCreateInput): Promise<Project> => {


    if (!payload.title) {
        throw new Error("Project title is required")
    }

    const existingProject = await prisma.project.findFirst({
        where: {
            title: payload.title
        }
    });

    if (existingProject) {
        throw new Error("A project with this title already exists")
    }

    const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}`

    let counter = 0;
    while (await prisma.project.findUnique({ where: { slug } })) {
        slug = `${slug}-${counter++}`
    }

    payload.slug = slug;

    const project = await prisma.project.create({
        data: payload,
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    return project

}






export const ProjectServices = {
    createProject
}