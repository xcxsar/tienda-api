// Dependencias de Express y MiddleWare

import express from 'express'; // Framework de Node.js para construir la API.
import morgan from 'morgan'; // Logging de solicitudes HTTP.
import cookieParser from 'cookie-parser'; // Manejar y parsear las cookies en las solicitudes.
import cors from 'cors'; // (Cross-Origin Resource Sharing) para gestionar permisos de origen.
import { config } from 'dotenv';

// Rutas
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/productos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import categoriesRoutes from './routes/category.route.js';

// Inicializar app
const app = express();

// -- Configuración de Middleware --

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow Postman (where origin is undefined)
    // 2. Allow your Vite frontend
    if (!origin || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(morgan('dev'));

app.use(express.json());

app.use(cookieParser());

// --- Definición de Rutas ---

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", ventasRoutes);
app.use("/api", categoriesRoutes);

export default app;