const Produto = require("../models/Produto");

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

const buscarProduto = async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
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

const atualizarProduto = async (req, res) => {
    try {
        const produto = await Produto.findByIdAndUpdate(
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

const excluirProduto = async (req, res) => {
    try {
        const produto = await Produto.findByIdAndDelete(req.params.id);
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

const comprarProduto = async (req, res) => {
    try {
        const quantidade = Number(req.body.quantidade);
        if (!quantidade || quantidade < 1 || !Number.isInteger(quantidade)) {
            return res.status(400).json({
                mensagem: "Quantidade inválida."
            });
        }
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }
        if (produto.estoque < quantidade) {
            return res.status(400).json({
                mensagem: `Estoque insuficiente. Estoque disponível: ${produto.estoque}`
            });
        }
        produto.estoque = produto.estoque - quantidade;
        if (produto.estoque === 0) {
            await Produto.findByIdAndDelete(produto._id);
            return res.status(200).json({
                mensagem: "Compra realizada com sucesso. O produto acabou e foi removido do estoque.",
                produtoRemovido: true,
                produtoId: produto._id
            });
        }
        await produto.save();
        res.status(200).json({
            mensagem: "Compra realizada com sucesso.",
            produtoRemovido: false,
            produto: produto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao processar a compra.",
            erro: error.message
        });
    }
};

module.exports = {
    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto,
    comprarProduto
};
