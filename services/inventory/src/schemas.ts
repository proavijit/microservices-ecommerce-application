import {z} from "zod";

// Avoid importing runtime enums from @prisma/client (they may not be exported as named JS values).
// Define the ActionType enum locally for validation purposes.
export const ActionType = {
    IN: 'IN',
    OUT: 'OUT'
} as const;
export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export const InventoryCreateDTOSchema = z.object({
    productId: z.string(),
    sku: z.string(),
    // allow zero and default to 0 when omitted
    quantity: z.number().int().nonnegative().optional().default(0),
})

export const InventoryUpdateDTOSchema = z.object({
	quantity: z.union([z.string().transform(val => parseInt(val)), z.number()]).pipe(z.number().int().positive()),
    actionType: z.enum(['IN', 'OUT']),
}).or(z.object({
	quantity: z.union([z.string().transform(val => parseInt(val)), z.number()]).pipe(z.number().int().positive()),
    ActionType: z.enum(['IN', 'OUT']).transform(val => val.toLowerCase().replace('type', '') + 'type'),
})).transform(data => ({
    quantity: data.quantity,
    actionType: 'actionType' in data ? data.actionType : data.ActionType
}));
