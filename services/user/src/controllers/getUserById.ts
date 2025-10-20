import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		// Validate the id parameter
		if (!id) {
			return res.status(400).json({ message: 'User ID is required' });
		}

		// Find the user by ID
		const user = await prisma.user.findUnique({
			where: { id: parseInt(id) },
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export default getUserById;
