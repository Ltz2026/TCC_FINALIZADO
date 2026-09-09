const express = require("express");

const router = express.Router();

const {
    criarPedido,
    listarPedidos,
    buscarPedidosUsuario,
    buscarPedidoPorId,
    atualizarStatus
} = require("../controllers/pedidoController");


router.post(
    "/",
    criarPedido
);

router.get(
    "/",
    listarPedidos
);

router.get(
    "/usuario/:usuarioId",
    buscarPedidosUsuario
);


router.get(
    "/:id",
    buscarPedidoPorId
);

router.put(
    "/:id/status",
    atualizarStatus
);


module.exports = router;