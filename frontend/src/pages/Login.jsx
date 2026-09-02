import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {

        const usuarioSalvo = localStorage.getItem("usuario");

        if (usuarioSalvo) {

            try {

                const usuario = JSON.parse(usuarioSalvo);

                if (usuario.tipo === "gerente") {
                    navigate("/produtos", { replace: true });
                } else {
                    navigate("/home", { replace: true });
                }

            } catch (error) {

                localStorage.removeItem("usuario");

            }
        }

    }, [navigate]);

    async function fazerLogin(event) {

        event.preventDefault();

        setErro("");

        if (!email.trim() || !senha) {
            setErro("Preencha o e-mail e a senha.");
            return;
        }

        /*
        ==========================================
        LOGIN DO GERENTE
        ==========================================
        */

        if (
            email.toLowerCase().trim() === "gerente@minhaloja.com" &&
            senha === "123456"
        ) {

            const gerente = {
                id: "gerente",
                nome: "Gerente",
                email: "gerente@minhaloja.com",
                tipo: "gerente"
            };

            localStorage.setItem(
                "usuario",
                JSON.stringify(gerente)
            );

            navigate("/produtos", {
                replace: true
            });

            return;
        }

        /*
        ==========================================
        LOGIN DOS USUÁRIOS NORMAIS
        ==========================================
        */

        try {

            setCarregando(true);

            const resposta = await fetch(
                "http://localhost:3001/usuarios/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        senha: senha
                    })
                }
            );

            const texto = await resposta.text();

            let dados;

            try {
                dados = JSON.parse(texto);
            } catch {
                throw new Error(
                    "O servidor não retornou uma resposta válida."
                );
            }

            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    dados.message ||
                    "E-mail ou senha incorretos."
                );
            }

            const usuario = dados.usuario || dados;

            const usuarioComTipo = {
                ...usuario,
                tipo: usuario.tipo || "usuario"
            };

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuarioComTipo)
            );

            navigate("/home", {
                replace: true
            });

        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao realizar login."
            );

        } finally {

            setCarregando(false);
        }
    }

    return (

        <main className="login">

            <div className="login-container">

                <div className="login-header">

                    <h1>LtStore</h1>

                    <p>
                        Entre na sua conta
                    </p>

                </div>

                {erro && (
                    <div className="login-erro">
                        {erro}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={fazerLogin}
                >

                    <div className="login-campo">

                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            disabled={carregando}
                        />

                    </div>

                    <div className="login-campo">

                        <label htmlFor="senha">
                            Senha
                        </label>

                        <input
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(event) =>
                                setSenha(event.target.value)
                            }
                            disabled={carregando}
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Entrando..."
                            : "Entrar"
                        }
                    </button>

                </form>

                <div className="login-cadastro">

                    <p>
                        Ainda não possui uma conta?
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/cadastro-usuario")
                        }
                    >
                        Criar uma conta
                    </button>

                </div>

                <div className="login-gerente">

                    
                </div>

            </div>

        </main>
    );
}

export default Login;