import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar conexión a base de datos
import connectDB from './drivers/connect-db.mjs';

// Importar rutas
import authRoutes from './routes/auth.mjs';
import inventarioRoutes from './routes/inventario.mjs';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware de CORS
app.use(cors({
  origin: '*', // Permitir todos los orígenes
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas de la API
app.use('/auth', authRoutes);
app.use('/productos', inventarioRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.status(200).json({
    state: true,
    message: 'API REST para sistema de eCommerce de productos para mascotas',
    data: {
      version: '1.0.0',
      endpoints: {
        auth: '/auth',
        productos: '/productos',
        inventario: '/productos (con autenticación)'
      },
      documentation: {
        login: 'POST /auth/login',
        profile: 'GET /auth/profile',
        productos: 'GET /productos',
        productoById: 'GET /productos/:id',
        movimientoInventario: 'POST /productos/movimiento',
        stockBajo: 'GET /productos (con auth)'
      }
    }
  });
});

// Ruta para endpoints no encontrados
app.use('*', (req, res) => {
  res.status(404).json({
    state: false,
    message: 'Endpoint no encontrado',
    error: 'La ruta solicitada no existe',
    data: {
      availableEndpoints: [
        'GET /',
        'POST /auth/login',
        'GET /auth/profile',
        'GET /productos',
        'GET /productos/:id',
        'POST /productos/movimiento',
        'GET /productos (con autenticación para stock bajo)'
      ]
    }
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  res.status(err.status || 500).json({
    state: false,
    message: err.message || 'Error interno del servidor',
    error: 'Error no controlado en el servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📚 Documentación: http://localhost:${PORT}/`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/auth/login`);
  console.log(`🛍️ Productos: GET http://localhost:${PORT}/productos`);
});

export default app;
