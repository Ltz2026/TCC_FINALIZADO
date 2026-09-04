import { useNavigate } from "react-router-dom";

import "./ProdutoCard.css";

function ProdutoCard({ produto, onExcluir }) {

    const navigate = useNavigate();


    // ==========================================
    // USUÁRIO LOGADO
    // ==========================================

    const usuarioSalvo =
        localStorage.getItem("usuario");

    let usuario = null;


    if (usuarioSalvo) {

        try {

            usuario =
                JSON.parse(usuarioSalvo);

        } catch {

            usuario = null;

        }

    }


    // ==========================================
    // VERIFICAR GERENTE
    // ==========================================

    const gerente =
        usuario?.tipo === "gerente";


    // ==========================================
    // EDITAR
    // ==========================================

    function editarProduto() {

        navigate(
            `/editar/${produto._id}`
        );

    }


    // ==========================================
    // EXCLUIR
    // ==========================================

    async function excluirProduto() {

        const confirmar =
            window.confirm(
                `Deseja realmente excluir o produto "${produto.nome}"?`
            );


        if (!confirmar) {

            return;

        }


        try {

            const resposta =
                await fetch(
                    `http://localhost:3001/produtos/${produto._id}`,
                    {
                        method: "DELETE"
                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Erro ao excluir produto."
                );

            }


            alert(
                "Produto excluído com sucesso!"
            );


            if (onExcluir) {

                onExcluir(
                    produto._id
                );

            }


        } catch (error) {

            console.error(error);


            alert(
                error.message ||
                "Erro ao excluir produto."
            );

        }

    }


    // ==========================================
    // COMPRAR
    // ==========================================

    function comprarProduto() {

        if (
            produto.estoque === undefined ||
            produto.estoque <= 0
        ) {

            alert(
                "Produto sem estoque."
            );

            return;

        }


        const carrinhoSalvo =
            localStorage.getItem(
                "carrinho"
            );


        let carrinho = [];


        if (carrinhoSalvo) {

            try {

                carrinho =
                    JSON.parse(
                        carrinhoSalvo
                    );

            } catch {

                carrinho = [];

            }

        }


        const produtoExistente =
            carrinho.find(
                item =>
                    item._id ===
                    produto._id
            );


        const quantidadeAtual =
            produtoExistente
                ? produtoExistente.quantidade
                : 0;


        if (
            quantidadeAtual >=
            produto.estoque
        ) {

            alert(
                "Você já adicionou todo o estoque disponível."
            );

            return;

        }


        if (produtoExistente) {

            produtoExistente.quantidade += 1;

        } else {

            carrinho.push({

                ...produto,

                quantidade: 1

            });

        }


        localStorage.setItem(
            "carrinho",
            JSON.stringify(
                carrinho
            )
        );


        navigate("/carrinho");

    }


    return (

        <div className="produto-card">


            {/* IMAGEM */}

            {produto.imagem && (

                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="produto-imagem"
                />

            )}


            <div className="produto-info">


                {/* NOME */}

                <h3>
                    {produto.nome}
                </h3>


                {/* DESCRIÇÃO */}

                <p>
                    {produto.descricao}
                </p>


                {/* PREÇO */}

                <strong>

                    R${" "}

                    {Number(
                        produto.preco
                    ).toFixed(2)}

                </strong>


                {/* ESTOQUE */}

                {produto.estoque !== undefined && (

                    <span>

                        Estoque:{" "}

                        {produto.estoque}

                    </span>

                )}


                {/* GERENTE */}

                {gerente ? (

                    <div className="produto-acoes">

                        <button
                            className="botao-editar"
                            onClick={
                                editarProduto
                            }
                        >

                            Editar

                        </button>


                        <button
                            className="botao-excluir"
                            onClick={
                                excluirProduto
                            }
                        >

                            Excluir

                        </button>

                    </div>

                ) : (


                    /* CLIENTE */

                    <button
                        className="botao-comprar"
                        onClick={
                            comprarProduto
                        }
                    >

                        Adicionar ao carrinho

                    </button>

                )}

            </div>

        </div>

    );

}

export default ProdutoCard;