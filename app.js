// Dependencias de Express y MiddleWare
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
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

// Lista de URLs e IPs permitidas para conectarse a tu API
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.1.14:5173',
  'http://192.168.0.5:5173'
];

// Configuración de CORS para Socket.IO usando tu arreglo de IPs
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS in Socket.io'));
      }
    },
    credentials: true
  }
});

// Guardamos la instancia de 'io' para poder llamarla desde los controladores
app.set('io', io);

// Log para verificar cuando un cliente (Punto de Venta) se conecte
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado a WebSocket:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// -- Configuración de Middleware --

// Configuración de CORS para Express usando el mismo arreglo
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS in Express'));
    }
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/assets', express.static('assets'));

// --- Definición de Rutas ---
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", ventasRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", printRoutes);

// Exportamos 'server'
export default server;
