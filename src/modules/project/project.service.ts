import { Prisma } from "@prisma/client"
import type { Project } from "@prisma/client"
import { prisma } from "../../config/db.js"
import { QueryBuilder } from "../../utils/queryBuilder.js";
import { projectSearchableFields } from "./project.constant.js";


type UpdatableProject = {
    title?: string;
    description?: string | null;
    features?: Prisma.InputJsonValue | typeof Prisma.JsonNull | typeof Prisma.DbNull;
    thumbnailUrl?: string | null;
    githubUrl?: string | null;
    liveUrl?: string | null;
    slug?: string | null;
};


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


const getProjectById = async (id: number) => {
    const result = await prisma.project.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            features: true,
            thumbnailUrl: true,
            githubUrl: true,
            liveUrl: true,
            createdAt: true,
            updatedAt: true,
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    return result
}


const deleteProject = async (id: number, userId: number) => {
    const existingProject = await prisma.project.findUnique({ where: { id } });

    if (!existingProject) {
        throw new Error("Project not found")
    }

    if (existingProject.ownerId !== userId) {
        throw new Error("Unauthorized: You can only delete your own project");
    }

    const result = await prisma.project.delete({
        where: {
            id
        }
    })

    return {
        data: null
    }
}


// const updateProject = async (payload: Partial<Project>, id: number, userId: number) => {
//     const existingProject = await prisma.project.findUnique({ where: { id } });

//     if (!existingProject) {
//         throw new Error("Project not found")
//     }

//     if (existingProject.ownerId !== userId) {
//         throw new Error("Unauthorized: You can only update your own project");
//     }

//     if (payload.title) {
//         const baseSlug = payload.title.toLowerCase().trim().split(" ").join("-");
//         let slug = baseSlug;
//         let counter = 1;

//         // ensure unique slug
//         while (await prisma.blog.findUnique({ where: { slug } })) {
//             slug = `${baseSlug}-${counter++}`;
//         }

//         payload.slug = slug;
//     }

//     const updateProject = await prisma.project.update({
//         where: {
//             id
//         },
//         data: payload,
//         include: {
//             owner: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true
//                 }
//             }
//         }
//     })


//     return updateProject;

// }


const updateProject = async (payload: UpdatableProject, id: number, userId: number) => {

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
        throw new Error("Project not found");
    }


    if (existingProject.ownerId !== userId) {
        throw new Error("Unauthorized: You can only update your own project");
    }


    if (payload.title) {
        const baseSlug = payload.title.toLowerCase().trim().split(" ").join("-");
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.project.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
        }

        payload.slug = slug;
    }

    // Handle null JSON fields safely
    if (payload.features === null) {
        payload.features = Prisma.DbNull; // avoids type error
    }


    const updatedProject = await prisma.project.update({
        where: { id },
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
    });

    return updatedProject;
};

export const ProjectServices = {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProject,
    updateProject
}