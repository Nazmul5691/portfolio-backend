import type { User } from "@prisma/client";
import { prisma } from "../../config/db.js";
import AppError from "../../errorHelpers/appError.js";
import { StatusCodes } from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/env.js";



// create user
const createUser = async (payload: Partial<User>) => {
    const { name, email, password } = payload;

    if (!name) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Name is required");
    }
    if (!email) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
    }
    if (!password) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Password is required");
    }

    const isUserExist = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User already exists");
    }

    const hashedPassword = await bcryptjs.hash(
        password,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        include: {
            blogs: true,
            projects: true,
            skills: true,
            experiences: true
        }
    });

    return user;
};



const getUserById = async(id: number) =>{
    const result = await prisma.user.findUnique({
        where:{
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            blogs: true,
            projects: true,
            skills: true,
            experiences: true
        }
    })

    return {
        data: result
    }
};




const getMe = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select:{
            // id: true,
            name: true,
            email: true,
            role: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            blogs: true,
            projects: true,
            skills: true,
            experiences: true
        }
    });

    return {
        data: user
    }
};





export const UserServices = {
    createUser,
    getUserById,
    getMe
};