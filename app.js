// Dependencias de Express y MiddleWare
import express from 'express'; 
import morgan from 'morgan'; 
import cookieParser from 'cookie-parser'; 
import cors from 'cors'; 
import { config } from 'dotenv';
import path from 'path'; // <--- 1. Importar path
import { fileURLToPath } from 'url'; // <--- 2. Importar para obtener rutas

// Rutas
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/productos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import categoriesRoutes from './routes/category.route.js';
import printRoutes from './routes/print.routes.js';

// --- CONFIGURACIÓN PARA __dirname (Necesario en ES Modules) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar app
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.1.68:5173',
   'http://192.168.0.5:5173'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Origen bloqueado por CORS:", origin);
      callback(new Error('Error de CORS: Origen no permitido'));
    }
  },
  credentials: true
}));

app.use(cookieParser()); // Ponlo aquí
app.use(express.json());
app.use(morgan('dev'));

// --- 3. SERVIR ARCHIVOS ESTÁTICOS ---
// Supongamos que tus imágenes están en una carpeta llamada 'uploads' en la raíz
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// --- Definición de Rutas ---
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", ventasRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", printRoutes);

export default app; 