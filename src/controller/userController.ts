import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import { promises } from "dns"
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "minimal" })

// create
const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password

        const findEmail = await prisma.user.findFirst({
            where: { email }
        })
        if (findEmail) {
            res.status(400).json({
                message: `Email has exists`
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: `Member`
            }
        })

        res.status(200).json({
            message: `User has been created`,
            data: newUser
        })

        return

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// read
const readUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search?.toString() || null;

        const allData = await prisma.user.findMany({
            where: search
                ? {
                    OR: [{
                        username: { contains: search },
                    },
                    {
                        email: { contains: search },
                    }],
                }
                : undefined, // Jika tidak ada search, tidak ada kondisi where
        });

        res.status(200).json({
            message: `User has been retrived`,
            data: allData,
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

// update
const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findUser = await prisma.user
            .findFirst({
                where: { id: Number(id) }
            })

        if (!findUser) {
            return res.status(200)
                .json({
                    message: `User is not found`
                })
        }
        const {
            username, password, role
        } = req.body

        const saveUser = await prisma.user
            .update({
                where: { id: Number(id) },
                data: {
                    username: username ? username : findUser.username,
                    password: password ? await bcrypt.hash(password, 12) : findUser.password,
                    role: role ? role : findUser.role
                }
            })

        return res.status(200)
            .json({
                message: `User has been updated`,
                data: saveUser
            })

    } catch (error) {
        console.log(error)
        return res.status(500)
            .json(error)
    }
}

// delete
const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findUsers = await prisma.user
            .findFirst({
                where: { id: Number(id) }
            })

        if (!findUsers) {
            return res.status(200)
                .json({
                    message: `User is not found`
                })
        }


        const saveUsers = await prisma.user
            .delete({
                where: { id: Number(id) }
            })

        return res.status(200)
            .json({
                message: `User has been removed`,
                data: saveUsers
            })

    } catch (error) {
        res.status(500)
            .json(error)
    }
}

// authentication
const authentication = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body
        
        /** check existing email */
        const findUser = await prisma.user.findFirst({
            where: { username }
        })

        if (!findUser) {
            return res.status(400)
                .json({
                    message: `Email is not registered`
                })
        }

        const isMatchPassword = await bcrypt.compare(password, findUser.password)

        if (!isMatchPassword) {
            return res.status(200)
                .json({
                    message: `Invalid password`
                })
        }

        const payload = {
            id: findUser?.id,
            username: findUser?.username,
            email: findUser?.email,
            UserRole: findUser?.role
        }

        const signature = process.env.SECRET || ``

        const token = Jwt.sign(payload, signature)

        return res.status(200).json({
            status: "success",
            message: "Login Berhasil",
            token,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json(error)

    }
}
export { createUser, readUser, updateUser, deleteUser, authentication }