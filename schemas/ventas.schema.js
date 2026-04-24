import {z} from 'zod';

export const createSalesSchema =z.array(
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
    }));

export const getsaleDetailsBySaleIdSchema = z.object({
    id: z.coerce
      .number({ required_error: 'El ID de la venta es obligatorio' })
      .positive('El ID de la venta debe ser un número positivo')
  });