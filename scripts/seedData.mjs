import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.mjs';
import Producto from '../models/Producto.mjs';

// Cargar variables de entorno
dotenv.config();

/**
 * Conectar a la base de datos
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'parcial'
    });
    console.log('✅ MongoDB conectado para seeding');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
    process.exit(1);
  }
};

/**
 * Poblar la base de datos con usuarios de ejemplo
 */
const seedUsuarios = async () => {
  try {
    // Eliminar usuarios existentes
    await Usuario.deleteMany({});
    
    const usuarios = [
      {
        name: 'Admin Sistema',
        email: 'admin@mascotas.com',
        password: 'admin123',
        isActive: true
      },
      {
        name: 'Juan Pérez',
        email: 'juan.perez@mascotas.com',
        password: 'empleado123',
        isActive: true
      },
      {
        name: 'María García',
        email: 'maria.garcia@mascotas.com',
        password: 'empleado123',
        isActive: true
      },
      {
        name: 'Carlos López',
        email: 'carlos.lopez@mascotas.com',
        password: 'empleado123',
        isActive: false // Usuario inactivo para pruebas
      }
    ];

    for (const usuarioData of usuarios) {
      const usuario = new Usuario(usuarioData);
      await usuario.save();
    }

    console.log('✅ Usuarios creados exitosamente');
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  }
};

/**
 * Poblar la base de datos con productos de ejemplo
 */
const seedProductos = async () => {
  try {
    // Eliminar productos existentes
    await Producto.deleteMany({});
    
    const productos = [
      {
        name: 'Alimento Premium para Perros Adultos',
        description: 'Alimento balanceado rico en proteínas para perros adultos de todas las razas',
        price: 45000,
        category: 'Alimento',
        stock: 50,
        stockMinimo: 10,
        isActive: true
      },
      {
        name: 'Alimento para Gatos Cachorros',
        description: 'Alimento especializado para gatos cachorros hasta 12 meses',
        price: 38000,
        category: 'Alimento',
        stock: 25,
        stockMinimo: 5,
        isActive: true
      },
      {
        name: 'Correa Retráctil para Perros',
        description: 'Correa retráctil de 5 metros, resistente y cómoda',
        price: 25000,
        category: 'Accesorios',
        stock: 15,
        stockMinimo: 3,
        isActive: true
      },
      {
        name: 'Shampoo para Mascotas',
        description: 'Shampoo hipoalergénico para perros y gatos',
        price: 18000,
        category: 'Higiene',
        stock: 30,
        stockMinimo: 8,
        isActive: true
      },
      {
        name: 'Juguete Pelota Interactiva',
        description: 'Pelota con sonido para entretenimiento de mascotas',
        price: 12000,
        category: 'Juguetes',
        stock: 8,
        stockMinimo: 5,
        isActive: true
      },
      {
        name: 'Vitamina Completa para Perros',
        description: 'Suplemento vitamínico para fortalecer el sistema inmunológico',
        price: 35000,
        category: 'Medicamentos',
        stock: 12,
        stockMinimo: 4,
        isActive: true
      },
      {
        name: 'Arena Sanitaria para Gatos',
        description: 'Arena aglomerante con control de olores',
        price: 28000,
        category: 'Higiene',
        stock: 20,
        stockMinimo: 6,
        isActive: true
      },
      {
        name: 'Cama Ortopédica para Perros',
        description: 'Cama ergonómica para perros de todas las edades',
        price: 85000,
        category: 'Accesorios',
        stock: 5,
        stockMinimo: 2,
        isActive: true
      },
      {
        name: 'Producto con Stock Bajo',
        description: 'Producto para probar alertas de stock bajo',
        price: 15000,
        category: 'Alimento',
        stock: 2,
        stockMinimo: 5,
        isActive: true
      },
      {
        name: 'Producto Inactivo',
        description: 'Producto descontinuado para pruebas',
        price: 10000,
        category: 'Juguetes',
        stock: 0,
        stockMinimo: 3,
        isActive: false
      }
    ];

    for (const productoData of productos) {
      const producto = new Producto(productoData);
      await producto.save();
    }

    console.log('✅ Productos creados exitosamente');
  } catch (error) {
    console.error('❌ Error al crear productos:', error);
  }
};

/**
 * Función principal para poblar la base de datos
 */
const seedDatabase = async () => {
  try {
    console.log('🚀 Iniciando proceso de seeding...');
    await connectDB();
    console.log('👥 Creando usuarios...');
    await seedUsuarios();
    console.log('🛍️ Creando productos...');
    await seedProductos();
    
    console.log('\n🎉 Base de datos poblada exitosamente');
    console.log('\n📋 Credenciales de prueba:');
    console.log('Admin: admin@mascotas.com / admin123');
    console.log('Empleado: juan.perez@mascotas.com / empleado123');
    console.log('Empleado: maria.garcia@mascotas.com / empleado123');
    console.log('Usuario Inactivo: carlos.lopez@mascotas.com / empleado123');
    console.log('\n🛍️ Productos creados: 10 productos (1 inactivo, 1 con stock bajo)');
    
    await mongoose.connection.close();
    console.log('🔒 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar seeding si se llama directamente
seedDatabase();

export { seedUsuarios, seedProductos };
