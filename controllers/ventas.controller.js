import { prismaClient } from '../utils/db.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { use } from 'react';

export const insertSales = async (req, res) => {

    const salesDetails = req.body;
     try {
            const userId = req.user.id; // Obtener el usuario autenticado
            
            if (!userId)
                return res.status(401).json({ message: 'Usuario no autenticado' });

            const savedVenta = await prismaClient.Sales.create({
                data: {
                    date: new Date(),
                    salesmanId: userId,
                    totalPrice : 0
                }
            });

            salesDetails.forEach(async (sale) => {
                const doSale = await prismaClient.salesDetail.create({
                    data: {
                        saleId: savedVenta.id,
                        productId: sale.productId,
                        quantity: sale.quantity,
                        salesPrice: sale.price,
                        rowTotal: sale.quantity * sale.price
                    }
                });
            });

            const   updatedTotalPrice = await prismaClient.Sales.aggregate({
                data:{
                    totalPrice: salesDetails.reduce((total, sale) => total + (sale.quantity * sale.salesPrice), 0)
                },
                where: { saleId: savedVenta.id }
            }); 

            res.json({
                id: savedVenta.id,
                date: savedVenta.date,
                salesmanId: savedVenta.salesmanId,
                totalPrice: savedVenta.totalPrice,
                salesDetails: []
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al realizar la venta' });
        }
}