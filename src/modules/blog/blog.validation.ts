import { z } from "zod/v3";

export const createBlogZodSchema = z.object({
    title: z
        .string({ invalid_type_error: "Title must be a string" })
        .min(2, { message: "Title must be at least 2 characters long" })
        .max(150, { message: "Title cannot exceed 150 characters" }),

    content: z
        .string({ invalid_type_error: "Content must be a string" })
        .min(10, { message: "Content must be at least 10 characters long" }),

    thumbnailUrl: z
        .string({ invalid_type_error: "Thumbnail URL must be a string" })
        .url({ message: "Thumbnail URL must be a valid URL" })
        .nullable()
        .optional(),
});
