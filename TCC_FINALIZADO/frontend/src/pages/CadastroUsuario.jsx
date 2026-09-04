import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CadastroUsuario.css";

function CadastroUsuario() {

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        senha: ""
    });

    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);


    function handleChange(event) {

        const { name, value } = event.target;

        setFormulario({
            ...formulario,
            [name]: value
        });

    }


    async function cadastrarUsuario(event) {

        event.preventDefault();

        setErro("");
        setMensagem("");


        if (
            !formulario.nome.trim() ||
            !formulario.email.trim() ||
            !formulario.senha.trim()
        ) {

            setErro(
                "Preencha todos os campos."
            );

            return;
        }


        try {

            setCarregando(true);


            const resposta = await fetch(
                "http://localhost:3001/usuarios",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nome: formulario.nome,
                        email: formulario.email,
                        senha: formulario.senha
                    })
                }
            );


            const dados = await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Erro ao criar conta."
                );

            }


            setMensagem(
                "Conta criada com sucesso!"
            );


            setFormulario({
                nome: "",
                email: "",
                senha: ""
            });


            setTimeout(() => {

                navigate("/");

            }, 1500);


        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao criar conta."
            );

        } finally {

            setCarregando(false);

        }

    }


    return (

        <main className="cadastro-usuario">

            <div className="cadastro-usuario-container">

                <div className="cadastro-usuario-header">

                    <h1>
                        Criar conta
                    </h1>

                    <p>
                        Cadastre-se para começar a comprar.
                    </p>

                </div>


                {erro && (

                    <div className="cadastro-usuario-mensagem erro">
                        {erro}
                    </div>

                )}


                {mensagem && (

                    <div className="cadastro-usuario-mensagem sucesso">
                        {mensagem}
                    </div>

                )}


                <form
                    className="cadastro-usuario-form"
                    onSubmit={cadastrarUsuario}
                >

                    <div className="cadastro-usuario-campo">

                        <label htmlFor="nome">
                            Nome
                        </label>

                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formulario.nome}
                            onChange={handleChange}
                            placeholder="Digite seu nome"
                        />

                    </div>


                    <div className="cadastro-usuario-campo">

                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formulario.email}
                            onChange={handleChange}
                            placeholder="Digite seu e-mail"
                        />

                    </div>


                    <div className="cadastro-usuario-campo">

                        <label htmlFor="senha">
                            Senha
                        </label>

                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formulario.senha}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                        />

                    </div>


                    <button
                        type="submit"
                        className="botao-criar-conta"
                        disabled={carregando}
                    >

                        {carregando
                            ? "Criando conta..."
                            : "Criar conta"
                        }

                    </button>


                    <button
                        type="button"
                        className="botao-voltar-login"
                        onClick={() => navigate("/")}
                    >
                        Já tenho uma conta
                    </button>

                </form>

            </div>

        </main>

    );

}

export default CadastroUsuario;