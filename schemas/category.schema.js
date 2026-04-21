  import {z} from 'zod';
    
    export const createCategorySchema = z.object({
        name: z.string({ required_error: 'El nombre de la categoria es obligatorio' })});

    export const deleteCategorySchema = z.object({
        id: z.coerce.number({ required_error: 'El ID de la categoria es obligatorio' }).positive('El ID debe ser un número positivo')
    });

    export const getCategoryByIdSchema = z.object({
        id: z.coerce.number().positive('El ID debe ser un número positivo').optional(),
        name: z.string().min(1, 'El nombre no puede estar vacío').optional()
        }).refine(
        (data) => data.id !== undefined || data.name !== undefined,{ message: "Debes enviar al menos id o name"}
    );

    export const updateCategorySchema = z.object({
        id: z.coerce.number({ required_error: 'El ID de la categoria es obligatorio' }).positive('El ID debe ser un número positivo') ,
        name: z.string({ required_error: 'El nombre nuevo de la categoria es obligatorio' })
    });
    