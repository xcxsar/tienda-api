import { prismaClient } from '../utils/db.js';
import {createSalesSchema,getsaleDetailsBySaleIdSchema} from '../schemas/ventas.schema.js';
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
export const getMostRecentSale = async (req, res) => { 
        try {
                const saleFound  = await prismaClient.Sales.findFirst({
                    orderBy: { date: 'desc' }
                });
                
                if (!saleFound) return res.status(404).json(["No se encontraron ventas."]);
                
                res.json({
                    saleFound
                });
    
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error al obtener la venta' });
            }
}
export const getsaleDetailsBySaleId = async (req, res) => {
        const result = getsaleDetailsBySaleIdSchema.parse(req.body);
        const {id} = result;
         try {
                // 1. Find id (Prisma uses findUnique for @unique fields)
                const {id: saleId} = await prismaClient.Sales.findUnique({
                    where: { id }
                }); 
                
                if (!saleId) return res.status(404).json(["No se encontraron detalles para esta venta."]);
                
                const salesDetailsFound = await prismaClient.salesDetail.findMany({
                    where: { saleId }
                });
                res.json(salesDetailsFound);
    
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error al obtener los detalles de la venta' });
            }
}