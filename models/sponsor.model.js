const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const sponsorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true // Remove espaços em branco desnecessários
  },
  email: { 
    type: String, 
    required: true,
    trim: true // Remove espaços em branco desnecessários
  },
  phone: { 
    type: String, 
    required: true,
    trim: true // Remove espaços em branco desnecessários
  },
  url: { 
    type: String, 
    required: true,
    trim: true // Remove espaços em branco desnecessários
  },
  nivel: { 
    type: String, 
    required: true,
    enum: ['Básico', 'Médio', 'Premuim'], // Exemplo de valores aceitáveis
    trim: true
  },
  categoria: { 
    type: String, 
    required: true,
    enum: ['Aves', 'Mamífero', 'Répteis', 'Peixe'], // Exemplo de valores aceitáveis
    trim: true
  },
  informacoes: { 
    type: String, 
    required: true,
    trim: true
  },
  urlfoto: { 
    type: String, 
    required: true,
    trim: true
  },
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

// O Mongoose adicionará automaticamente o campo _id
module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.sponsor, sponsorSchema);
