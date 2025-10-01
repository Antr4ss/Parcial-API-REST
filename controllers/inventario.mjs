import Producto from '../models/Producto.mjs';

/**
 * Controlador para registrar movimiento de inventario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {void}
 */
export const registrarMovimiento = async (req, res) => {
  try {
    const { productoId, tipoMovimiento, cantidad, observacion } = req.body;

    // Validar campos obligatorios
    if (!productoId || !tipoMovimiento || !cantidad) {
      return res.status(400).json({
        state: false,
        message: 'ProductoId, tipoMovimiento y cantidad son obligatorios',
        error: 'Faltan campos requeridos para el movimiento'
      });
    }

    // Validar tipo de movimiento
    if (!['entrada', 'salida'].includes(tipoMovimiento)) {
      return res.status(400).json({
        state: false,
        message: 'Tipo de movimiento inválido',
        error: 'El tipoMovimiento debe ser "entrada" o "salida"'
      });
    }

    // Validar cantidad
    if (cantidad <= 0) {
      return res.status(400).json({
        state: false,
        message: 'La cantidad debe ser mayor a 0',
        error: 'Cantidad inválida'
      });
    }

    // Buscar el producto
    const producto = await Producto.findById(productoId);
    
    if (!producto) {
      return res.status(404).json({
        state: false,
        message: 'Producto no encontrado',
        error: 'El producto especificado no existe'
      });
    }

    if (!producto.isActive) {
      return res.status(400).json({
        state: false,
        message: 'El producto está inactivo',
        error: 'No se pueden realizar movimientos en productos inactivos'
      });
    }

    const stockAnterior = producto.stock;
    let stockNuevo;

    // Procesar según el tipo de movimiento
    if (tipoMovimiento === 'entrada') {
      // ENTRADA: Siempre permitida, suma la cantidad al stock actual
      stockNuevo = stockAnterior + cantidad;
      producto.stock = stockNuevo;
    } else if (tipoMovimiento === 'salida') {
      // SALIDA: Solo permitida si hay existencias suficientes
      if (!producto.canWithdraw(cantidad)) {
        return res.status(400).json({
          state: false,
          message: 'Stock insuficiente para realizar la salida',
          error: `Stock actual: ${stockAnterior}, Stock mínimo: ${producto.stockMinimo}, Cantidad solicitada: ${cantidad}`,
          data: {
            stockActual: stockAnterior,
            stockMinimo: producto.stockMinimo,
            cantidadSolicitada: cantidad,
            cantidadDisponible: Math.max(0, stockAnterior - producto.stockMinimo)
          }
        });
      }
      stockNuevo = stockAnterior - cantidad;
      producto.stock = stockNuevo;
    }

    // Guardar el producto actualizado
    await producto.save();

    // Respuesta exitosa
    res.status(200).json({
      state: true,
      message: `Movimiento de ${tipoMovimiento} registrado exitosamente`,
      data: {
        producto: {
          id: producto._id,
          name: producto.name,
          stockAnterior,
          stockNuevo,
          stockMinimo: producto.stockMinimo
        },
        movimiento: {
          tipoMovimiento,
          cantidad,
          observacion: observacion || '',
          fecha: new Date()
        }
      }
    });

  } catch (error) {
    console.error('Error en movimiento de inventario:', error);
    res.status(500).json({
      state: false,
      message: 'Error interno del servidor',
      error: 'Error al procesar el movimiento de inventario'
    });
  }
};

/**
 * Controlador para listar productos con stock bajo
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {void}
 */
export const listarProductosStockBajo = async (req, res) => {
  try {
    // Buscar productos donde el stock actual es menor o igual al stock mínimo
    const productosStockBajo = await Producto.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$stockMinimo'] }
    }).select('name description price category stock stockMinimo');

    // Calcular información adicional
    const productosConInfo = productosStockBajo.map(producto => ({
      id: producto._id,
      name: producto.name,
      description: producto.description,
      price: producto.price,
      category: producto.category,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      diferencia: producto.stock - producto.stockMinimo,
      necesitaReposicion: producto.stock < producto.stockMinimo
    }));

    res.status(200).json({
      state: true,
      message: 'Productos con stock bajo obtenidos exitosamente',
      data: {
        productos: productosConInfo,
        total: productosConInfo.length,
        resumen: {
          stockCritico: productosConInfo.filter(p => p.stock < p.stockMinimo).length,
          stockBajo: productosConInfo.filter(p => p.stock === p.stockMinimo).length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({
      state: false,
      message: 'Error interno del servidor',
      error: 'Error al obtener productos con stock bajo'
    });
  }
};

/**
 * Controlador para obtener todos los productos (para uso en rutas públicas)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {void}
 */
export const listarProductos = async (req, res) => {
  try {
    // Buscar todos los productos activos
    const productos = await Producto.find({ isActive: true })
      .select('name description price category stock stockMinimo')
      .sort({ name: 1 });

    res.status(200).json({
      state: true,
      message: 'Productos obtenidos exitosamente',
      data: {
        productos,
        total: productos.length
      }
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      state: false,
      message: 'Error interno del servidor',
      error: 'Error al obtener la lista de productos'
    });
  }
};

/**
 * Controlador para obtener un producto por ID (para uso en rutas públicas)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {void}
 */
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findOne({ 
      _id: id, 
      isActive: true 
    }).select('name description price category stock stockMinimo');

    if (!producto) {
      return res.status(404).json({
        state: false,
        message: 'Producto no encontrado',
        error: 'El producto especificado no existe o está inactivo'
      });
    }

    res.status(200).json({
      state: true,
      message: 'Producto obtenido exitosamente',
      data: {
        producto
      }
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      state: false,
      message: 'Error interno del servidor',
      error: 'Error al obtener el producto'
    });
  }
};
