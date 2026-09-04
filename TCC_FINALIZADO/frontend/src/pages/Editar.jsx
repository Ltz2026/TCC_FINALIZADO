import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./Editar.css";

function Editar() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [formulario, setFormulario] = useState({

        nome: "",
        descricao: "",
        preco: "",
        estoque: "",
        imagem: ""

    });


    const [carregando, setCarregando] =
        useState(true);

    const [salvando, setSalvando] =
        useState(false);

    const [erro, setErro] =
        useState("");

    const [mensagem, setMensagem] =
        useState("");


    // ==========================================
    // BUSCAR PRODUTO
    // ==========================================

    useEffect(() => {

        buscarProduto();

    }, [id]);


    async function buscarProduto() {

        try {

            setCarregando(true);

            setErro("");


            const resposta =
                await fetch(
                    `http://localhost:3001/produtos/${id}`
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Produto não encontrado."
                );

            }


            // Colocar dados do produto no formulário

            setFormulario({

                nome: dados.nome || "",

                descricao:
                    dados.descricao || "",

                preco:
                    dados.preco ?? "",

                estoque:
                    dados.estoque ?? "",

                imagem:
                    dados.imagem || ""

            });


        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao carregar produto."
            );


        } finally {

            setCarregando(false);

        }

    }


    // ==========================================
    // ALTERAR CAMPOS
    // ==========================================

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;


        setFormulario({

            ...formulario,

            [name]: value

        });

    }


    // ==========================================
    // SALVAR ALTERAÇÕES
    // ==========================================

    async function salvarAlteracoes(event) {

        event.preventDefault();


        setErro("");

        setMensagem("");


        // Validação

        if (!formulario.nome.trim()) {

            setErro(
                "Digite o nome do produto."
            );

            return;

        }


        if (!formulario.descricao.trim()) {

            setErro(
                "Digite a descrição do produto."
            );

            return;

        }


        if (
            formulario.preco === "" ||
            Number(formulario.preco) < 0
        ) {

            setErro(
                "Digite um preço válido."
            );

            return;

        }


        if (
            formulario.estoque === "" ||
            Number(formulario.estoque) < 0
        ) {

            setErro(
                "Digite um estoque válido."
            );

            return;

        }


        try {

            setSalvando(true);


            const resposta =
                await fetch(
                    `http://localhost:3001/produtos/${id}`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                nome:
                                    formulario.nome,

                                descricao:
                                    formulario.descricao,

                                preco:
                                    Number(
                                        formulario.preco
                                    ),

                                estoque:
                                    Number(
                                        formulario.estoque
                                    ),

                                imagem:
                                    formulario.imagem

                            })

                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Erro ao atualizar produto."
                );

            }


            setMensagem(
                "Produto atualizado com sucesso!"
            );


            // Esperar um pouco e voltar para produtos

            setTimeout(() => {

                navigate("/produtos");

            }, 1000);


        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao atualizar produto."
            );


        } finally {

            setSalvando(false);

        }

    }


    // ==========================================
    // CARREGANDO
    // ==========================================

    if (carregando) {

        return (

            <main className="editar-produto">

                <div className="editar-container">

                    <p className="editar-carregando">
                        Carregando produto...
                    </p>

                </div>

            </main>

        );

    }


    // ==========================================
    // TELA
    // ==========================================

    return (

        <main className="editar-produto">

            <div className="editar-container">


                <div className="editar-header">

                    <h1>
                        Editar Produto
                    </h1>

                    <p>
                        Altere as informações do produto.
                    </p>

                </div>


                {/* ERRO */}

                {erro && (

                    <div className="editar-mensagem erro">

                        {erro}

                    </div>

                )}


                {/* SUCESSO */}

                {mensagem && (

                    <div className="editar-mensagem sucesso">

                        {mensagem}

                    </div>

                )}


                <form
                    className="editar-form"
                    onSubmit={
                        salvarAlteracoes
                    }
                >


                    {/* NOME */}

                    <div className="editar-campo">

                        <label htmlFor="nome">
                            Nome do produto
                        </label>

                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={
                                formulario.nome
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Nome do produto"
                        />

                    </div>


                    {/* DESCRIÇÃO */}

                    <div className="editar-campo">

                        <label htmlFor="descricao">
                            Descrição
                        </label>

                        <textarea
                            id="descricao"
                            name="descricao"
                            value={
                                formulario.descricao
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Descrição do produto"
                            rows="5"
                        />

                    </div>


                    {/* PREÇO E ESTOQUE */}

                    <div className="editar-campo-duplo">


                        <div className="editar-campo">

                            <label htmlFor="preco">
                                Preço
                            </label>

                            <input
                                type="number"
                                id="preco"
                                name="preco"
                                value={
                                    formulario.preco
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                            />

                        </div>


                        <div className="editar-campo">

                            <label htmlFor="estoque">
                                Estoque
                            </label>

                            <input
                                type="number"
                                id="estoque"
                                name="estoque"
                                value={
                                    formulario.estoque
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="1"
                            />

                        </div>

                    </div>


                    {/* IMAGEM */}

                    <div className="editar-campo">

                        <label htmlFor="imagem">
                            Link da imagem
                        </label>

                        <input
                            type="text"
                            id="imagem"
                            name="imagem"
                            value={
                                formulario.imagem
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://..."
                        />

                    </div>


                    {/* PREVIEW DA IMAGEM */}

                    {formulario.imagem && (

                        <div className="editar-preview">

                            <p>
                                Pré-visualização
                            </p>

                            <img
                                src={
                                    formulario.imagem
                                }
                                alt="Pré-visualização"
                                onError={(event) => {

                                    event.currentTarget.style.display =
                                        "none";

                                }}
                            />

                        </div>

                    )}


                    {/* BOTÕES */}

                    <div className="editar-botoes">

                        <button
                            type="button"
                            className="botao-cancelar"
                            onClick={() =>
                                navigate("/produtos")
                            }
                        >
                            Cancelar
                        </button>


                        <button
                            type="submit"
                            className="botao-salvar"
                            disabled={salvando}
                        >

                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"
                            }

                        </button>

                    </div>


                </form>

            </div>

        </main>

    );

}

export default Editar;