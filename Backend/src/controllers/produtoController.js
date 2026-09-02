const Produto = require("../models/Produto");

// ==========================================
// LISTAR TODOS OS PRODUTOS
// ==========================================

const listarProdutos = async (req, res) => {

    try {

        const produtos = await Produto.find();

        res.status(200).json(produtos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: error.message
        });

    }

};


// ==========================================
// BUSCAR PRODUTO POR ID
// ==========================================

const buscarProduto = async (req, res) => {

    try {

        const produto = await Produto.findById(
            req.params.id
        );

        if (!produto) {

            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });

        }

        res.status(200).json(produto);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: error.message
        });

    }

};


// ==========================================
// CADASTRAR PRODUTO
// ==========================================

const cadastrarProduto = async (req, res) => {

    try {

        const produto = new Produto(req.body);

        await produto.save();

        res.status(201).json(produto);

    } catch (error) {

        console.error(error);

        res.status(400).json({
            mensagem: error.message
        });

    }

};


// ==========================================
// ATUALIZAR PRODUTO
// ==========================================

const atualizarProduto = async (req, res) => {

    try {

        const produto =
            await Produto.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!produto) {

            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });

        }

        res.status(200).json(produto);

    } catch (error) {

        console.error(error);

        res.status(400).json({
            mensagem: error.message
        });

    }

};


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

const excluirProduto = async (req, res) => {

    try {

        const produto =
            await Produto.findByIdAndDelete(
                req.params.id
            );

        if (!produto) {

            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });

        }

        res.status(200).json({
            mensagem: "Produto excluído com sucesso."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: error.message
        });

    }

};


// ==========================================
// FINALIZAR COMPRA DE UM PRODUTO
// ==========================================

const comprarProduto = async (req, res) => {

    try {

        const quantidade = Number(
            req.body.quantidade
        );

        // Verificar quantidade

        if (
            !quantidade ||
            quantidade < 1 ||
            !Number.isInteger(quantidade)
        ) {

            return res.status(400).json({
                mensagem: "Quantidade inválida."
            });

        }


        // Procurar produto

        const produto =
            await Produto.findById(
                req.params.id
            );


        if (!produto) {

            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });

        }


        // Verificar estoque

        if (
            produto.estoque < quantidade
        ) {

            return res.status(400).json({

                mensagem:
                    `Estoque insuficiente. Estoque disponível: ${produto.estoque}`

            });

        }


        // Diminuir estoque

        produto.estoque =
            produto.estoque - quantidade;


        // ==========================================
        // SE O ESTOQUE CHEGAR A ZERO
        // EXCLUIR DO MONGODB
        // ==========================================

        if (produto.estoque === 0) {

            await Produto.findByIdAndDelete(
                produto._id
            );

            return res.status(200).json({

                mensagem:
                    "Compra realizada com sucesso. O produto acabou e foi removido do estoque.",

                produtoRemovido: true,

                produtoId: produto._id

            });

        }


        // ==========================================
        // SALVAR NOVO ESTOQUE
        // ==========================================

        await produto.save();


        res.status(200).json({

            mensagem:
                "Compra realizada com sucesso.",

            produtoRemovido: false,

            produto: produto

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensagem:
                "Erro ao processar a compra.",

            erro: error.message

        });

    }

};


// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {

    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto,
    comprarProduto

};