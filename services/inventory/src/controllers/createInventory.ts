import { Request, Response, NextFunction } from "express";

import { InventoryCreateDTOSchema } from '@/schemas';
import prisma from "@/prisma";

const createInventory = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    // validate request body
    const parsedBody = InventoryCreateDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }

    // create inventory
    const quantityToSet = parsedBody.data.quantity ?? 0;
    const inventory = await prisma.inventory.create({
      data: {
        ...parsedBody.data,
        quantity: quantityToSet,
        histories: {
          create: {
            actionType: "IN",
            quantityChanged: quantityToSet,
            lastQuantity: 0,
            newQuantity: quantityToSet
          }
        }
      },
      select: {
        id: true,
        productId: true,
        sku: true,
        quantity: true
      }
    });

    // Ensure response always contains quantity (fallback to parsed/default)
    const responseBody = {
      ...inventory,
      quantity: (inventory as any).quantity ?? quantityToSet,
    };

    return res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
};

export default createInventory;
