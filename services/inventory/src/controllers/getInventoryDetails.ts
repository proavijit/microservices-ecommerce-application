import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";

const getInventoryDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;  
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        histories: {
          orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                actionType: true,
                quantityChanged: true,
                lastQuantity: true,
                newQuantity: true,
                createdAt: true
            }
        }
      }
    });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.json(inventory);
    } catch (error) {
        next(error);
    }
}

export default getInventoryDetails;

