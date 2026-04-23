import { prismaClient } from '../utils/db.js';
import {createSalesSchema} from '../schemas/ventas.schema.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export const createSales = async (req, res) => {
    const result = createSalesSchema.parse(req.body);
    const salesDetails = result; 
    
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        if (!salesDetails || salesDetails.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron detalles de venta' });
        }

        const totalVenta = salesDetails.reduce((total, item) => total + (item.quantity * item.salesPrice), 0);

        const resultado = await prismaClient.$transaction(async (tx) => {
            
            const savedVenta = await tx.Sales.create({
                data: {
                    date: new Date(),
                    salesmanId: userId,
                    totalPrice: totalVenta*1.16 
                }
            });

            const detallesGuardados = [];
            for (const item of salesDetails) {
                const detail = await tx.salesDetail.create({
                    data: {
                        saleId: savedVenta.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        salesPrice: item.salesPrice,
                        rowTotal: item.quantity * item.salesPrice
                    }
                });
                detallesGuardados.push(detail);
                
                const product = await tx.Products.findUnique({
                    where: { id: item.productId }
                });

                if (!product || product.stock < item.quantity) {
                throw new Error(`No hay suficiente stock para el producto ID ${item.productId}`);
                }

                await tx.Products.update({
                    where: { id: item.productId },
                    data: {
                        units: { decrement: item.quantity }
                    }
                    });
            }

            return { ...savedVenta, details: detallesGuardados };
        });

        res.json(resultado);

    } catch (error) {
        console.error("Error en la transacción:", error);
        return res.status(500).json({ message: 'Error al realizar la venta', error: error.message });
    }
}
