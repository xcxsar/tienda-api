   import {z} from 'zod';
    
    export const createProductSchema = z.object({
        name: z.string({ required_error: 'El nombre del producto es obligatorio' }),
        price: z.coerce.number({ required_error: 'El precio nuevo es obligatorio' }).positive('El precio debe ser un número positivo'),
        categoryId: z.coerce.number().positive('El Id debe ser positivo').default(1),
        urlImg: z.string({ required_error: 'La URL de la imagen es obligatoria' }).url('La URL debe ser válida'),
    });

    export const deleteProductSchema = z.object({
        id: z.coerce.number({ required_error: 'El ID del producto es obligatorio' }).positive('El ID debe ser un número positivo')
    });

    export const getProductByIdSchema = z.object({
        id: z.coerce.number().positive('El ID debe ser un número positivo').optional(),
        name: z.string().min(1, 'El nombre no puede estar vacío').optional()
        }).refine(
        (data) => data.id !== undefined || data.name !== undefined,{ message: "Debes enviar al menos id o name"}
    );

    export const updateProductSchema = z.object({
        id: z.coerce.number({ required_error: 'El ID del producto es obligatorio' }).positive('El ID debe ser un número positivo') ,
        name: z.string().optional(),
        price: z.coerce.number().positive('El precio debe ser un número positivo').optional(),
        units : z.coerce.number().positive('Las unidades deben ser un número positivo').optional(),
        categoryId: z.coerce.number().positive('El Id debe ser positivo').optional(),
        urlImg: z.string().url('La URL debe ser válida').optional(),
    });
    
    export const getProductsByCategoryIdSchema = z.object({
        categoryId: z.coerce.number().positive('El Id debe ser positivo')
    });