import express from 'express';
import { 
  registrarMovimiento, 
  listarProductosStockBajo,
  listarProductos,
  obtenerProductoPorId 
} from '../controllers/inventario.mjs';
import { authenticateToken } from '../middlewares/auth.mjs';

const router = express.Router();

/**
 * POST /inventario/movimiento
 * Endpoint para registrar movimiento de inventario (ENTRADA/SALIDA)
 * Headers: Authorization: Bearer <token>
 * Body: { productoId, tipoMovimiento, cantidad, observacion }
 * Respuesta: { state, message, data: { producto, movimiento } }
 */
router.post('/movimiento', authenticateToken, registrarMovimiento);

/**
 * GET /inventario/productos
 * Endpoint para listar productos con stock bajo (solo usuarios autenticados)
 * Headers: Authorization: Bearer <token>
 * Respuesta: { state, message, data: { productos, total, resumen } }
 */
router.get('/productos', authenticateToken, listarProductosStockBajo);

/**
 * GET /productos
 * Endpoint público para listar todos los productos
 * Respuesta: { state, message, data: { productos, total } }
 */
router.get('/', listarProductos);

/**
 * GET /productos/:id
 * Endpoint público para obtener producto por ID
 * Params: id (ObjectId del producto)
 * Respuesta: { state, message, data: { producto } }
 */
router.get('/:id', obtenerProductoPorId);

export default router;
