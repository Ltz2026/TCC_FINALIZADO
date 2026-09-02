const Usuario = require("../models/Usuario");

// Cadastrar usuário
const cadastrarUsuario = async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {

            return res.status(400).json({
                mensagem: "Nome, e-mail e senha são obrigatórios."
            });
        }

        const usuarioExistente = await Usuario.findOne({
            email
        });

        if (usuarioExistente) {

            return res.status(400).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const usuario = new Usuario({
            nome,
            email,
            senha
        });

        await usuario.save();

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: error.message
        });
    }
};


// Login
const loginUsuario = async (req, res) => {

    try {

        const { email, senha } = req.body;

        if (!email || !senha) {

            return res.status(400).json({
                mensagem: "E-mail e senha são obrigatórios."
            });
        }

        const usuario = await Usuario.findOne({
            email
        });

        if (!usuario) {

            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        if (usuario.senha !== senha) {

            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",

            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: error.message
        });
    }
};


module.exports = {
    cadastrarUsuario,
    loginUsuario
};