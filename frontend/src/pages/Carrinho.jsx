import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Carrinho.css";

function Carrinho() {
    const navigate = useNavigate();
    const [carrinho, setCarrinho] = useState([]);
    const [finalizando, setFinalizando] = useState(false);

    useEffect(() => {
        carregarCarrinho();
    }, []);

    function carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem("carrinho");

        if (!carrinhoSalvo) {
            setCarrinho([]);
            return;
        }

        try {
            const dados = JSON.parse(carrinhoSalvo);

            if (!Array.isArray(dados)) {
                setCarrinho([]);
                return;
            }

            setCarrinho(dados);
        } catch {
            setCarrinho([]);
            localStorage.removeItem("carrinho");
        }
    }

    function removerProduto(id) {
        const novoCarrinho = carrinho.filter(
            produto => produto._id !== id
        );

        setCarrinho(novoCarrinho);

        localStorage.setItem(
            "carrinho",
            JSON.stringify(novoCarrinho)
        );
    }

    function alterarQuantidade(id, quantidade) {
        if (quantidade < 1) {
            return;
        }

        const novoCarrinho = carrinho.map(produto => {
            if (produto._id === id) {
                if (quantidade > produto.estoque) {
                    alert("Quantidade maior que o estoque disponível.");
                    return produto;
                }

                return {
                    ...produto,
                    quantidade
                };
            }

            return produto;
        });

        setCarrinho(novoCarrinho);

        localStorage.setItem(
            "carrinho",
            JSON.stringify(novoCarrinho)
        );
    }

    function obterUsuario() {
        const usuarioSalvo = localStorage.getItem("usuario");

        if (!usuarioSalvo) {
            return null;
        }

        try {
            return JSON.parse(usuarioSalvo);
        } catch {
            return null;
        }
    }

    async function finalizarCompra() {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        const usuario = obterUsuario();

        if (!usuario) {
            alert("Você precisa estar logado para finalizar a compra.");
            navigate("/");
            return;
        }

        if (usuario.tipo === "gerente") {
            alert("O gerente não pode realizar compras.");
            return;
        }

        const usuarioId = usuario.id || usuario._id;

        if (!usuarioId) {
            alert("Não foi possível identificar o usuário.");
            return;
        }

        try {
            setFinalizando(true);

            const produtos = carrinho.map(produto => ({
                produtoId: produto._id,
                quantidade: Number(produto.quantidade)
            }));

            const resposta = await fetch(
                "http://localhost:3001/pedidos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuarioId,
                        usuarioNome: usuario.nome,
                        usuarioEmail: usuario.email,
                        produtos
                    })
                }
            );

            const texto = await resposta.text();
            let dados;

            try {
                dados = JSON.parse(texto);
            } catch {
                console.error("Resposta do servidor:", texto);

                throw new Error(
                    "O servidor não retornou uma resposta válida."
                );
            }

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                    "Erro ao finalizar compra."
                );
            }

            localStorage.removeItem("carrinho");
            setCarrinho([]);

            alert("Compra realizada com sucesso!");

            navigate("/pedidos");
        } catch (error) {
            console.error("Erro ao finalizar compra:", error);

            alert(
                error.message ||
                "Erro ao finalizar compra."
            );

            carregarCarrinho();
        } finally {
            setFinalizando(false);
        }
    }

    const total = carrinho.reduce(
        (soma, produto) => {
            return (
                soma +
                (
                    Number(produto.preco) *
                    Number(produto.quantidade)
                )
            );
        },
        0
    );

    return (
        <main className="carrinho">
            <div className="carrinho-container">
                <h1>Meu Carrinho</h1>

                {carrinho.length === 0 ? (
                    <div className="carrinho-vazio">
                        <h2>Seu carrinho está vazio</h2>
                        <p>Adicione produtos para continuar.</p>
                    </div>
                ) : (
                    <>
                        <div className="carrinho-produtos">
                            {carrinho.map(produto => (
                                <div
                                    className="carrinho-item"
                                    key={produto._id}
                                >
                                    {produto.imagem && (
                                        <img
                                            src={produto.imagem}
                                            alt={produto.nome}
                                        />
                                    )}

                                    <div>
                                        <h3>{produto.nome}</h3>
                                        <p>
                                            R${" "}
                                            {Number(produto.preco).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="quantidade">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                alterarQuantidade(
                                                    produto._id,
                                                    produto.quantidade - 1
                                                )
                                            }
                                            disabled={finalizando}
                                        >
                                            −
                                        </button>

                                        <span>
                                            {produto.quantidade}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                alterarQuantidade(
                                                    produto._id,
                                                    produto.quantidade + 1
                                                )
                                            }
                                            disabled={finalizando}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="remover-carrinho"
                                        onClick={() =>
                                            removerProduto(produto._id)
                                        }
                                        disabled={finalizando}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="carrinho-total">
                            <h2>
                                Total: R${" "}
                                {total.toFixed(2)}
                            </h2>

                            <button
                                type="button"
                                className="finalizar-compra"
                                onClick={finalizarCompra}
                                disabled={finalizando}
                            >
                                {finalizando
                                    ? "Processando..."
                                    : "Finalizar Compra"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Carrinho;