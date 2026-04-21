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
    })
  , {
    required_error: 'Debe enviar productos en la venta'
  })
  .nonempty('Se debe proporcionar al menos un producto para la venta');