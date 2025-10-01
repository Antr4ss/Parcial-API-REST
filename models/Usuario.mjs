import mongoose from 'mongoose';

// Esquema del modelo Usuario
const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    // IMPORTANTE: Se almacena en texto plano según requisitos
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Método para eliminar campos sensibles del JSON
usuarioSchema.methods.toJSON = function() {
  const usuarioObject = this.toObject();
  delete usuarioObject.password; // No enviar password en las respuestas
  return usuarioObject;
};

// Crear y exportar el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
