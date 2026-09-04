const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema(
    {

        usuarioId: {
            type: String,
            required: true
        },

        usuarioNome: {
            type: String,
            required: true
        },

        usuarioEmail: {
            type: String,
            required: true
        },

        produtos: [
            {

                produtoId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Produto",
                    required: true
                },

                nome: {
                    type: String,
                    required: true
                },

                preco: {
                    type: Number,
                    required: true
                },

                quantidade: {
                    type: Number,
                    required: true
                },

                imagem: {
                    type: String,
                    default: ""
                }

            }
        ],

        total: {
            type: Number,
            required: true
        },

        status: {
            type: String,

            enum: [
                "Pendente",
                "Enviado"
            ],

            default: "Pendente"
        }

    },

    {
        timestamps: true
    }

);

module.exports =
    mongoose.model(
        "Pedido",
        pedidoSchema
    );