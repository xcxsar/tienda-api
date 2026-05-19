import 'dotenv/config';
import app from './app.js';
import { prismaClient } from './utils/db.js';
const PORT = 3000;

async function start() {
    try{
        await prismaClient.$connect();
        console.log('Conexion a la base de datos establecida');

        app.listen(PORT,'0.0.0.0', () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

start();