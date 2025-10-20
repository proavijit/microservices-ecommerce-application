import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { InventoryUpdateDTOSchema } from '../schemas';

const updateInventoryByProductId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// check if the inventory exists by productId
		const { productId } = req.params;
		const inventory = await prisma.inventory.findUnique({
			where: { productId },
		});

		if (!inventory) {
			return res.status(404).json({ message: 'Inventory not found for this product' });
		}

		// update the inventory
		const parsedBody = InventoryUpdateDTOSchema.safeParse(req.body);
		if (!parsedBody.success) {
			console.log('Validation error:', parsedBody.error.errors);
			console.log('Request body:', req.body);
			return res.status(400).json({
				message: 'Validation failed',
				errors: parsedBody.error.errors
			});
		}

		// find the last history
		const lastHistory = await prisma.history.findFirst({
			where: { inventoryId: inventory.id },
			orderBy: { createdAt: 'desc' },
		});

		// calculate the new quantity
		let newQuantity = inventory.quantity;
		if (parsedBody.data.actionType === 'IN') {
			newQuantity += parsedBody.data.quantity;
		} else if (parsedBody.data.actionType === 'OUT') {
			newQuantity -= parsedBody.data.quantity;
		} else {
			return res.status(400).json({ message: 'Invalid action type' });
		}

		// update the inventory
		const updatedInventory = await prisma.inventory.update({
			where: { id: inventory.id },
			data: {
				quantity: newQuantity,
				histories: {
					create: {
						actionType: parsedBody.data.actionType,
						quantityChanged: parsedBody.data.quantity,
						lastQuantity: lastHistory?.newQuantity || inventory.quantity,
						newQuantity,
					},
				},
			},
			select: {
				id: true,
				productId: true,
				sku: true,
				quantity: true,
			},
		});

		return res.status(200).json({
			message: 'Inventory updated successfully',
			data: updatedInventory
		});
	} catch (error) {
		next(error);
	}
};

export default updateInventoryByProductId;
