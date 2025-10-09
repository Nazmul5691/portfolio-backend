import type { Prisma, Project } from "@prisma/client"
import { prisma } from "../../config/db.js"
import { QueryBuilder } from "../../utils/queryBuilder.js";
import { projectSearchableFields } from "./project.constant.js";





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



const getAllProjects = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(prisma.project, query)

    const projectQuery = queryBuilder
        .filter()
        .search(projectSearchableFields)
        .sort()
        .fields()
        .paginate()


    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        projectQuery.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};


export const ProjectServices = {
    createProject,
    getAllProjects
}