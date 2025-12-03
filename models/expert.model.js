const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const expertSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true,
    trim: true // Remove espaços em branco desnecessários
  },
  especialidade: { 
    type: String, 
    required: true,
    enum: ['Aves', 'Mamífero', 'Répteis', 'Peixe'], // Exemplo de valores aceitáveis
    trim: true
  },
  tituloacademico: { 
    type: String, 
    required: true,
    trim: true
  },
  biografia: { 
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
module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.expert, expertSchema);
