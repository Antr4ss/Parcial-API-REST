import Usuario from '../models/Usuario.mjs';
import { generateToken } from '../middlewares/auth.mjs';

/**
 * Controlador para el login de usuarios
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {void}
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen email y password
    if (!email || !password) {
      return res.status(400).json({
        state: false,
        message: 'Email y contraseña son obligatorios',
        error: 'Faltan credenciales de acceso'
      });
    }

    // Buscar usuario por email (incluyendo password)
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        state: false,
        message: 'Credenciales inválidas',
        error: 'Usuario no encontrado'
      });
    }

    if (!usuario.isActive) {
      return res.status(401).json({
        state: false,
        message: 'Usuario inactivo',
        error: 'La cuenta está desactivada'
      });
    }

    // Verificar contraseña (texto plano según requisitos)
    if (usuario.password !== password) {
      return res.status(401).json({
        state: false,
        message: 'Credenciales inválidas',
        error: 'Contraseña incorrecta'
      });
    }

    // Generar token JWT
    const token = generateToken(usuario._id);

    // Respuesta exitosa
    res.status(200).json({
      state: true,
      message: 'Login exitoso',
      data: {
        usuario: {
          id: usuario._id,
          name: usuario.name,
          email: usuario.email,
          isActive: usuario.isActive
        },
        token,
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      state: false,
      message: 'Error interno del servidor',
      error: 'Error al procesar el login'
    });
  }
};

/**
 * Controlador para obtener el perfil del usuario autenticado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {void}
 */
export const getProfile = async (req, res) => {
  try {
    // Si llegamos aquí, el middleware de autenticación ya validó el token
    res.status(200).json({
      state: true,
      message: 'Perfil obtenido exitosamente',
      data: {
        usuario: {
          id: req.usuario._id,
          name: req.usuario.name,
          email: req.usuario.email,
          isActive: req.usuario.isActive,
          createdAt: req.usuario.createdAt,
          updatedAt: req.usuario.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      state: false,
      message: 'Error interno del servidor',
      error: 'Error al obtener el perfil del usuario'
    });
  }
};
