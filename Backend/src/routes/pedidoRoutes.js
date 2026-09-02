const express = require("express");

const router = express.Router();

const {
    criarPedido,
    listarPedidos,
    buscarPedidosUsuario,
    buscarPedidoPorId,
    atualizarStatus
} = require("../controllers/pedidoController");


// ==========================================
// CRIAR PEDIDO
// ==========================================

router.post(
    "/",
    criarPedido
);


// ==========================================
// TODOS OS PEDIDOS
// ==========================================

router.get(
    "/",
    listarPedidos
);


// ==========================================
// PEDIDOS DO CLIENTE
// ==========================================

router.get(
    "/usuario/:usuarioId",
    buscarPedidosUsuario
);


// ==========================================
// PEDIDO ESPECÍFICO
// ==========================================

router.get(
    "/:id",
    buscarPedidoPorId
);


// ==========================================
// ALTERAR STATUS
// ==========================================

router.put(
    "/:id/status",
    atualizarStatus
);


module.exports = router;