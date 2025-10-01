# API REST - Sistema de eCommerce para Mascotas

## 📋 Descripción

API REST desarrollada para el sistema de eCommerce de productos de comida para mascotas. Implementa módulos de autenticación y gestión de inventarios con control de stock mínimo.

## 🏗️ Estructura del Proyecto

```
├── controllers/
│   ├── auth.mjs              # Controladores de autenticación
│   └── inventario.mjs        # Controladores de inventario y productos
├── models/
│   ├── Usuario.mjs           # Modelo de usuario
│   └── Producto.mjs          # Modelo de producto
├── routes/
│   ├── auth.mjs              # Rutas de autenticación
│   └── inventario.mjs        # Rutas de inventario y productos
├── middlewares/
│   └── auth.mjs              # Middleware de autenticación JWT
├── drivers/
│   └── connect-db.mjs        # Conexión a MongoDB Atlas
├── scripts/
│   └── seedData.mjs          # Script para poblar base de datos
├── index.js                  # Servidor principal
├── package.json              # Configuración del proyecto
├── .env                      # Variables de entorno
└── API_DOCUMENTATION.md      # Documentación completa de la API
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Actualiza el archivo `.env` con tus credenciales de MongoDB Atlas:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/
DB_NAME=parcial
JWT_SECRET=gnin2LlwvdMfj3z4c8zFXhz5EpLanNb1hvRdZkxALWlq0aZARZzc/ZbcEI2Z/SNLF+amGkZiqRnM6EzXyN0e4Q==
```

### 3. Poblar base de datos
```bash
npm run seed
```

### 4. Ejecutar servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 🔑 Credenciales de Prueba

Después de ejecutar `npm run seed`:

- **Admin**: `admin@mascotas.com` / `admin123`
- **Empleado**: `juan.perez@mascotas.com` / `empleado123`
- **Empleado**: `maria.garcia@mascotas.com` / `empleado123`

## 📚 Endpoints Principales

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Obtener perfil (requiere autenticación)

### Productos (Públicos)
- `GET /productos` - Listar todos los productos
- `GET /productos/:id` - Obtener producto por ID

### Inventario (Requiere Autenticación)
- `POST /productos/movimiento` - Registrar movimiento de inventario
- `GET /productos` (con auth) - Listar productos con stock bajo

## 🔄 Flujo de Trabajo

1. **Usuario no autenticado**: Solo puede consultar productos
2. **Usuario autenticado**: Puede gestionar inventario
3. **Entrada de productos**: Aumenta el stock disponible
4. **Salida de productos**: Disminuye el stock, validando stock mínimo

## ⚠️ Validaciones Importantes

- **Entrada**: Siempre permitida, suma cantidad al stock
- **Salida**: Solo permitida si `(stock actual - cantidad) >= stockMinimo`
- **Passwords**: Almacenados en texto plano (según requisitos)
- **Tokens JWT**: Válidos por 24 horas

## 🧪 Pruebas Rápidas

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mascotas.com","password":"admin123"}'

# 2. Obtener productos
curl http://localhost:3000/productos

# 3. Registrar entrada (usar token del login)
curl -X POST http://localhost:3000/productos/movimiento \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productoId":"product_id","tipoMovimiento":"entrada","cantidad":10,"observacion":"Compra"}'
```

## 📖 Documentación Completa

Ver `API_DOCUMENTATION.md` para documentación detallada de todos los endpoints, modelos de datos y ejemplos de uso.

## 🛡️ Características de Seguridad

- Autenticación JWT
- Validación de datos de entrada
- Manejo de errores consistente
- Passwords en texto plano (según requisitos del proyecto)

## 📊 Tecnologías Utilizadas

- **Node.js** con Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **ES Modules** (.mjs)
- **dotenv** para variables de entorno

## ✅ Requisitos Cumplidos

- ✅ Estructura de proyecto exacta según especificaciones
- ✅ Modelos Usuario y Producto implementados
- ✅ Autenticación JWT funcional
- ✅ Endpoints públicos para productos
- ✅ Endpoints protegidos para inventario
- ✅ Validaciones de stock mínimo
- ✅ Passwords en texto plano
- ✅ Respuestas con estructura estándar
- ✅ Manejo de errores apropiado
- ✅ Documentación completa
