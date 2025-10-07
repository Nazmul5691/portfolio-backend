import type { Blog, Prisma } from "@prisma/client"
import { prisma } from "../../config/db.js"

const createBlog = async (payload: Prisma.BlogCreateInput): Promise<Blog> => {

    const existingBlog = await prisma.blog.findFirst({
        where: {
            title: payload.title
        }
    });

    if (existingBlog) {
        throw new Error("A blog with this title already exists")
    }

    const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}`

    let counter = 0;
    while (await prisma.blog.findUnique({ where: { slug } })) {
        slug = `${slug}-${counter++}`
    }

    payload.slug = slug;

    const blog = await prisma.blog.create({
        data: payload,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });


    return blog;
}




export const BlogServices = {
    createBlog
}