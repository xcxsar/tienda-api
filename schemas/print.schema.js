import {date, z} from 'zod';

export const printReceiptSchema = z.object({
  venta: 
    z.object({
            id: z.coerce.number({ required_error: 'El ID de la venta es obligatorio' }),
            total: z.coerce .number({ required_error: 'El total de la venta es obligatorio' }).positive('El total debe ser un número positivo'),
            date: z.coerce.date({ required_error: 'La fecha de la venta es obligatoria' }),
            salesmanId: z.coerce.number({ required_error: 'El ID del vendedor es obligatorio' }).positive('El ID del vendedor debe ser un número positivo')}
        ),
  
  salesDetails: z.array(
    z.object({
            salesPrice: z.coerce
                .number({ required_error: 'El precio de venta es obligatorio' })
                .positive('El precio debe ser un número positivo'),
            productId: z.coerce
                .number({ required_error: 'El producto es obligatorio' })
                .positive('El Id debe ser positivo'),
            quantity: z.coerce
                .number({ required_error: 'La cantidad es obligatoria' })
                .positive('La cantidad debe ser un número positivo')
            }))
});