import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.mjs';

/**
 * Middleware para verificar el token JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {void}
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        state: false,
        message: 'Token de acceso requerido',
        error: 'No se proporcionó token de autenticación'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(decoded.id).select('+password');
    
    if (!usuario) {
      return res.status(401).json({
        state: false,
        message: 'Usuario no encontrado',
        error: 'El token hace referencia a un usuario inexistente'
      });
    }

    if (!usuario.isActive) {
      return res.status(401).json({
        state: false,
        message: 'Usuario inactivo',
        error: 'La cuenta de usuario está desactivada'
      });
    }

    // Agregar el usuario al objeto request
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        state: false,
        message: 'Token inválido',
        error: 'El token proporcionado no es válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        state: false,
        message: 'Token expirado',
        error: 'El token ha expirado, por favor inicia sesión nuevamente'
      });
    }

    console.error('Error en autenticación:', error);
    return res.status(500).json({
      state: false,
      message: 'Error interno del servidor',
      error: 'Error al procesar la autenticación'
    });
  }
};

/**
 * Función para generar token JWT
 * @param {String} userId - ID del usuario
 * @returns {String} Token JWT generado
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
