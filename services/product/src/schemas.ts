import { Status } from './generated/prisma';
import { z } from 'zod';

export const ProductCreateDTOSchema = z.object({
	sku: z.string().min(3).max(10),
	name: z.string().min(3).max(255),
	description: z.string().max(1000).optional(),
	price: z.number().optional().default(0),
	status: z.nativeEnum(Status).optional().default(Status.DRAFT),
});

export const ProductUpdateDTOSchema = z.object({
	sku: z.string().min(3).max(10).optional(),
	name: z.string().min(3).max(255).optional(),
	description: z.string().max(1000).optional(),
	price: z.number().optional(),
	status: z.nativeEnum(Status).optional(),
});
