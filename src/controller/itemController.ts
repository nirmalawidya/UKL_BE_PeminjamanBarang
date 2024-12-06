import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// create
const createItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.body.name
        const category = req.body.category 
        const location = req.body.location
        const quantity = req.body.quantity

        const newData = await prisma.item.create({
            data: {
                name: name,
                category: category,
                location: location,
                quantity: quantity,
            }
        })

        res.status(201).json({
            status: 'success',
            message: "Barang berhasil ditambahkan",
            data: newData
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// read
const readItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        // Jika ID ada, cari berdasarkan ID, jika tidak tampilkan semua
        const data = id
            ? await prisma.item.findUnique({
                where: {
                    id: Number(id),
                },
            })
            : await prisma.item.findMany();

        // Jika ID diberikan tapi data tidak ditemukan
        if (id && !data) {
            res.status(404).json({
                message: `Item with ID ${id} not found`,
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            message: `Item has been retrived`,
            data: data,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// update
const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findData = await prisma.item.findFirst({
            where: {
                id: Number(id)
            }
        })

        if(!findData){
            res.status(404).json({
                message: `item not found`
            })
        }

        const {name, category, location, quantity} = req.body

        const newData = await prisma.item.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name ?? findData?.name,
                category: category ?? findData?.category,
                location: location ?? findData?.location,
                quantity: quantity ?? findData?.quantity,
            }
        })

        res.status(200).json({
            status: 'success',
            message: "Barang berhasil diubah",
            data: newData
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete
const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findData = await prisma.item.findFirst({
            where: { id: Number(id) }
        })

        if(!findData) {
            res.status(404).json({
                message: `Item not found`
            })
        }

        await prisma.item.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({
            message: `item has been deleted`
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export { createItem, readItem, updateItem, deleteItem }