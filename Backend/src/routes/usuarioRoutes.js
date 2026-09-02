const express = require("express");

const router = express.Router();

const {
    cadastrarUsuario,
    loginUsuario
} = require("../controllers/usuarioController.js");

router.post("/", cadastrarUsuario);

router.post("/login", loginUsuario);

module.exports = router;