import type { Blog, Prisma } from "@prisma/client"
import { prisma } from "../../config/db.js"
import { QueryBuilder } from "../../utils/queryBuilder.js";
import { blogSearchableFields } from "./blog.constant.js";




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


const getAllBlogs = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(prisma.blog, query)

    const blogsQuery = queryBuilder
        .filter()
        .search(blogSearchableFields)
        .sort()
        .fields()
        .paginate()


    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        blogsQuery.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};


const updateBlog = async (id: number, payload: Partial<Blog>, userId: number) => {

    const existingBlog = await prisma.blog.findUnique({ where: { id } });

    if (!existingBlog) {
        throw new Error("Blog not found")
    };

    if (existingBlog.authorId !== userId) {
        throw new Error("Unauthorized: You can only update your own blog");
    }


    if (payload.title) {
        const baseSlug = payload.title.toLowerCase().trim().split(" ").join("-");
        let slug = baseSlug;
        let counter = 1;

        // ensure unique slug
        while (await prisma.blog.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
        }

        payload.slug = slug;
    }



    const updatedBlog = await prisma.blog.update({
        where: { id },
        data: payload,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return updatedBlog;
}


const getBlogById = async (id: number) => {
    const result = await prisma.blog.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            content: true,
            slug: true,
            thumbnailUrl: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    picture: true,
                },
            },
        }
    })

    return {
        data: result
    }
};



const deleteBlog = async (id: number, userId: number) => {


    const existingBlog = await prisma.blog.findUnique({ where: { id } });

    if (!existingBlog) {
        throw new Error("Blog not found");
    }

    if (existingBlog.authorId !== userId) {
        throw new Error("Unauthorized: You can only delete your own blog");
    }


    const result = await prisma.blog.delete({
        where: {
            id
        }
    })

    return {
        data: null
    }
}



export const BlogServices = {
    createBlog,
    getAllBlogs,
    updateBlog,
    getBlogById,
    deleteBlog
}