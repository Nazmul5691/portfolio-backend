import { z } from "zod/v3";



export const RoleEnum = z.enum(["Admin"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be a valid enum value",
});



export const createUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be a string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),

    email: z
        .string({ invalid_type_error: "Email must be a string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),

    password: z
        .string({ invalid_type_error: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
        .regex(/\d/, { message: "Password must include at least one number" })
        .regex(/[!@#$%^&*]/, { message: "Password must include at least one special character" }),

    role: RoleEnum.optional(),
    picture: z.string().url({ message: "Picture must be a valid URL" }).nullable().optional(),


    blogs: z.array(z.any()).optional(),
    projects: z.array(z.any()).optional(),
    skills: z.array(z.any()).optional(),
    experiences: z.array(z.any()).optional()
});


