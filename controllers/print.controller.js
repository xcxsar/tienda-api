import path from 'path';
import { prismaClient } from '../utils/db.js';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import { printReceiptSchema } from '../schemas/print.schema.js';
import os from 'os';
import pkg from 'pdf-to-printer'; 
import unixPrinter from 'unix-print'; 

//El nombre de la impresora puede variar según el sistema y la configuración, asegúrate de usar el nombre correcto para tu entorno.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateProductsList = async (salesDetails) => {

    const productIds = salesDetails.map(p => p.productId);
    const productosDB = await prismaClient.Products.findMany({
            where: {
                id: { in: productIds }
            }
            });
            
    const productos = await Promise.all(
        salesDetails.map(async (item) => {

            const product = productosDB.find(p => p.id === item.productId);
            
            return {
                name: product.name,
                quantity: item.quantity,
                salesPrice: item.salesPrice
            };
        })
    );

    return productos.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.quantity}</td>
            <td>$${p.salesPrice}</td>
            <td>$${p.quantity * p.salesPrice}</td>
        </tr>
    `).join('');
};

const generateHTMLReceipt = async (venta, salesDetails) => {
    const filasProductos = await generateProductsList(salesDetails);
   
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #000;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .info {
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background: #f5f5f5;
        }

        .total {
            margin-top: 20px;
            text-align: right;
            font-size: 18px;
            font-weight: bold;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
        }
        </style>
    </head>

    <body>

        <div class="header">
        <div>
            <strong>Tienda</strong><br>
            RFC: XAXX010101000<br>
            Guasave, Sinaloa
        </div>

        <div>
            <strong>Folio:</strong> ${venta.id}<br>
            <strong>Fecha:</strong> ${venta.date.toLocaleString()}<br>
            <strong>Vendedor:</strong> ${venta.salesmanId}
        </div>
        </div>

        <div class="title">RECIBO DE VENTA</div>

        <div class="info">
        <strong>Cliente</strong> 
        </div>

        <table>
        <thead>
            <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            ${filasProductos}  
        </tbody>
        </table>

        <div class="total">
        SubTOTAL: $${venta.total/1.16} <br>
        IVA: $${venta.total/1.16*0.16} <br>
        TOTAL: $${venta.total}
        </div>

        <div class="footer">
        Gracias por su compra
        </div>

    </body>
    </html>
    `;
};

const printPDF = async (ruta, impresora) => {
    if (os.platform() === 'win32') {
        await pkg.print(ruta, { printer: impresora });
    } else {
       
        await unixPrinter.print(ruta, impresora);
    }
};

export const printReceipt = async (req, res) => {
    let browser;
    let filePath;

    try {
        const result = printReceiptSchema.parse(req.body);
        const { venta, salesDetails } = result;

        const html = await generateHTMLReceipt(venta, salesDetails);

       browser = await puppeteer.launch({ 
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        filePath = path.join(__dirname, '../assets/PDFs', `recibo-${venta.id}-${Date.now()}.pdf`);

        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        browser = null; 

        await printPDF(filePath, 'Microsoft Print to PDF');

        
        res.json({ message: 'Recibo generado e impreso correctamente' });

    } catch (error) {
        console.error("Error en printReceipt:", error);
        
        if (browser) await browser.close();
        
        res.status(500).json({ 
            message: 'Error al generar el recibo',
            error: error.message 
        });
    }
};