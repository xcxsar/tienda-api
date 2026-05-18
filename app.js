// Dependencias de Express y MiddleWare
import express from 'express'; // Framework de Node.js para construir la API.
import morgan from 'morgan'; // Logging de solicitudes HTTP.
import cookieParser from 'cookie-parser'; // Manejar y parsear las cookies en las solicitudes.
import cors from 'cors'; // (Cross-Origin Resource Sharing) para gestionar permisos de origen.
import { config } from 'dotenv';

// --- NUEVAS DEPENDENCIAS PARA WEBSOCKETS ---
import http from 'http'; 
import { Server } from 'socket.io'; 

// Rutas
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/productos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import categoriesRoutes from './routes/category.route.js';
import printRoutes from './routes/print.routes.js';

// Inicializar app
const app = express();

// --- CONFIGURACIÓN DE SERVIDOR HTTP Y SOCKET.IO ---
const server = http.createServer(app);

// Es crucial aplicar las mismas reglas de CORS de Express a Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin === 'http://localhost:5173') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }
});

// Guardamos la instancia de 'io' para poder llamarla desde los controladores (ej. ventas)
app.set('io', io);

// Log para verificar cuando un cliente (Punto de Venta) se conecte
io.on('connection', (socket) => {
  console.log('Cliente conectado a WebSocket:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

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
app.use("/api", printRoutes);

// --- CAMBIO IMPORTANTE AQUÍ ---
// Exportamos 'server' (el servidor HTTP con Socket.IO y Express) en lugar de solo 'app'
export default server;