const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },

    descricao: {
        type: String,
        required: true
    },

    preco: {
        type: Number,
        required: true
    },

    estoque: {
        type: Number,
        required: true,
        min: 0
    },

    imagem: {
        type: String,
        default: ""
    }

});

module.exports =
    mongoose.model(
        "Produto",
        produtoSchema
    );