import express from 'express';
import { login, getProfile } from '../controllers/auth.mjs';
import { authenticateToken } from '../middlewares/auth.mjs';

const router = express.Router();

/**
 * POST /auth/login
 * Endpoint para iniciar sesión
 * Body: { email, password }
 * Respuesta: { state, message, data: { usuario, token, expiresIn } }
 */
router.post('/login', login);

/**
 * GET /auth/profile
 * Endpoint para obtener el perfil del usuario autenticado
 * Headers: Authorization: Bearer <token>
 * Respuesta: { state, message, data: { usuario } }
 */
router.get('/profile', authenticateToken, getProfile);

export default router;
