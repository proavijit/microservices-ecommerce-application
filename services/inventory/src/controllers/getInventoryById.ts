import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";

const getInventoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const inventory = await prisma.inventory.findUnique({
        where: { id },
        select: {
            id: true,
            productId: true,
            sku: true,
            quantity: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!inventory) {
        return res.status(404).json({ message: "Inventory not found" });
    }
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

export default getInventoryById;
