const express = require("express");

const router = express.Router();

const {
    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto,
    comprarProduto
} = require("../controllers/produtoController");


router.get(
    "/",
    listarProdutos
);


router.get(
    "/:id",
    buscarProduto
);


router.post(
    "/",
    cadastrarProduto
);


router.put(
    "/:id",
    atualizarProduto
);


router.delete(
    "/:id",
    excluirProduto
);


router.post(
    "/:id/comprar",
    comprarProduto
);


module.exports = router;