    import {z} from 'zod';
    
    export const insertProductSchema = z.object({
        name: z.string({ required_error: 'El nombre del producto es obligatorio' }),
        price: z.coerce.number({ required_error: 'El precio nuevo es obligatorio' }).positive('El precio debe ser un número positivo')
    });

    export const deleteProductSchema = z.object({
        id: z.coerce.number({ required_error: 'El ID del producto es obligatorio' }).positive('El ID debe ser un número positivo')
    });

    export const getProductSchema = z.object({
        id: z.coerce.number().positive('El ID debe ser un número positivo').optional(),
        name: z.string().min(1, 'El nombre no puede estar vacío').optional()
        }).refine(
        (data) => data.id !== undefined || data.name !== undefined,{ message: "Debes enviar al menos id o name"}
    );

    export const updateProductSchema = z.object({
        id: z.coerce.number({ required_error: 'El ID del producto es obligatorio' }).positive('El ID debe ser un número positivo') ,
        name: z.string({ required_error: 'El nombre nuevo del producto es obligatorio' }),
        price: z.coerce.number({ required_error: 'El precio nuevo es obligatorio' }).positive('El precio debe ser un número positivo'),
        units : z.coerce.number({ required_error: 'Las unidades son obligatorias' }).positive('Las unidades deben ser un número positivo')
    });