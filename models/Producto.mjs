import mongoose from 'mongoose';

// Esquema del modelo Producto
const productoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    maxlength: [50, 'La categoría no puede exceder 50 caracteres']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  stockMinimo: {
    type: Number,
    required: [true, 'El stock mínimo es obligatorio'],
    min: [0, 'El stock mínimo no puede ser negativo']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Método para verificar si el stock es suficiente para una salida
productoSchema.methods.canWithdraw = function(cantidad) {
  return (this.stock - cantidad) >= this.stockMinimo;
};

// Método para actualizar stock
productoSchema.methods.updateStock = function(cantidad, tipoMovimiento) {
  if (tipoMovimiento === 'entrada') {
    this.stock += cantidad;
  } else if (tipoMovimiento === 'salida') {
    if (!this.canWithdraw(cantidad)) {
      throw new Error(`Stock insuficiente. Stock actual: ${this.stock}, Stock mínimo: ${this.stockMinimo}, Cantidad solicitada: ${cantidad}`);
    }
    this.stock -= cantidad;
  }
};

// Índices para mejorar el rendimiento de las consultas
productoSchema.index({ category: 1 });
productoSchema.index({ isActive: 1 });

// Crear y exportar el modelo
const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
