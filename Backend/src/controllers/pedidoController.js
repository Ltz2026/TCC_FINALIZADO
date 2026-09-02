const Pedido = require("../models/Pedido");
const Produto = require("../models/Produto");

// ==========================================
// CRIAR PEDIDO
// ==========================================

async function criarPedido(req, res) {

    const produtosAlterados = [];

    try {

        const {
            usuarioId,
            usuarioNome,
            usuarioEmail,
            produtos
        } = req.body;

        if (!usuarioId || !usuarioNome || !usuarioEmail) {

            return res.status(400).json({
                mensagem: "Usuário não identificado."
            });

        }

        if (!Array.isArray(produtos) || produtos.length === 0) {

            return res.status(400).json({
                mensagem: "O carrinho está vazio."
            });

        }

        const produtosParaPedido = [];

        let total = 0;

        for (const item of produtos) {

            const quantidade = Number(item.quantidade);

            if (!Number.isInteger(quantidade) || quantidade < 1) {

                return res.status(400).json({
                    mensagem: `Quantidade inválida para o produto ${item.nome}.`
                });

            }

            const produto = await Produto.findById(
                item.produtoId || item._id
            );

            if (!produto) {

                return res.status(404).json({
                    mensagem: `O produto não está mais disponível.`
                });

            }

            if (produto.estoque < quantidade) {

                return res.status(400).json({
                    mensagem:
                        `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}.`
                });

            }

            const subtotal =
                Number(produto.preco) * quantidade;

            total += subtotal;

            produtosParaPedido.push({

                produtoId: produto._id,

                nome: produto.nome,

                preco: produto.preco,

                quantidade,

                imagem: produto.imagem || ""

            });

            produtosAlterados.push({

                produto,

                quantidade

            });

        }

        // ==========================================
        // ATUALIZAR ESTOQUE
        // ==========================================

        for (const item of produtosAlterados) {

            const produto = item.produto;

            const quantidade = item.quantidade;

            const novoEstoque =
                produto.estoque - quantidade;

            if (novoEstoque === 0) {

                await Produto.findByIdAndDelete(
                    produto._id
                );

            } else {

                produto.estoque = novoEstoque;

                await produto.save();

            }

        }

        // ==========================================
        // CRIAR PEDIDO
        // ==========================================

        const pedido = await Pedido.create({

            usuarioId,

            usuarioNome,

            usuarioEmail,

            produtos: produtosParaPedido,

            total: Number(total.toFixed(2)),

            status: "Pendente"

        });

        return res.status(201).json({

            mensagem: "Pedido criado com sucesso!",

            pedido

        });

    } catch (error) {

        console.error(
            "Erro ao criar pedido:",
            error
        );

        return res.status(500).json({

            mensagem: "Erro ao finalizar a compra.",

            erro: error.message

        });

    }

}


// ==========================================
// LISTAR TODOS OS PEDIDOS
// USADO PELO GERENTE
// ==========================================

async function listarPedidos(req, res) {

    try {

        const pedidos = await Pedido
            .find()
            .sort({
                createdAt: -1
            });

        return res.status(200).json(pedidos);

    } catch (error) {

        console.error(
            "Erro ao buscar pedidos:",
            error
        );

        return res.status(500).json({

            mensagem: "Erro ao buscar pedidos.",

            erro: error.message

        });

    }

}


// ==========================================
// PEDIDOS DO USUÁRIO
// USADO PELO CLIENTE
// ==========================================

async function buscarPedidosUsuario(req, res) {

    try {

        const {
            usuarioId
        } = req.params;

        if (!usuarioId) {

            return res.status(400).json({

                mensagem:
                    "ID do usuário não informado."

            });

        }

        const pedidos = await Pedido
            .find({
                usuarioId
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json(pedidos);

    } catch (error) {

        console.error(
            "Erro ao buscar pedidos do usuário:",
            error
        );

        return res.status(500).json({

            mensagem:
                "Erro ao buscar pedidos do usuário.",

            erro: error.message

        });

    }

}


// ==========================================
// BUSCAR PEDIDO POR ID
// ==========================================

async function buscarPedidoPorId(req, res) {

    try {

        const {
            id
        } = req.params;

        const pedido =
            await Pedido.findById(id);

        if (!pedido) {

            return res.status(404).json({

                mensagem:
                    "Pedido não encontrado."

            });

        }

        return res.status(200).json(pedido);

    } catch (error) {

        console.error(
            "Erro ao buscar pedido:",
            error
        );

        return res.status(500).json({

            mensagem:
                "Erro ao buscar pedido.",

            erro: error.message

        });

    }

}


// ==========================================
// ALTERAR STATUS DO PEDIDO
// ==========================================

async function atualizarStatus(req, res) {

    try {

        const {
            id
        } = req.params;

        const {
            status
        } = req.body;

        // Somente estes dois status
        // serão utilizados

        const statusPermitidos = [
            "Pendente",
            "Enviado"
        ];

        if (
            !statusPermitidos.includes(status)
        ) {

            return res.status(400).json({

                mensagem:
                    "O status deve ser Pendente ou Enviado."

            });

        }

        const pedido =
            await Pedido.findByIdAndUpdate(

                id,

                {
                    status
                },

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!pedido) {

            return res.status(404).json({

                mensagem:
                    "Pedido não encontrado."

            });

        }

        return res.status(200).json({

            mensagem:
                "Status atualizado com sucesso!",

            pedido

        });

    } catch (error) {

        console.error(
            "Erro ao atualizar status:",
            error
        );

        return res.status(500).json({

            mensagem:
                "Erro ao atualizar status.",

            erro: error.message

        });

    }

}


module.exports = {

    criarPedido,

    listarPedidos,

    buscarPedidosUsuario,

    buscarPedidoPorId,

    atualizarStatus

};