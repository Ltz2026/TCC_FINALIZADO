import { useEffect, useState } from "react";

import ProdutoCard from "../components/ProdutoCard";

import "./Produtos.css";

function Produtos() {

    const [produtos, setProdutos] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    useEffect(() => {

        buscarProdutos();

    }, []);

    async function buscarProdutos() {

        try {

            setCarregando(true);

            const resposta = await fetch(
                "http://localhost:3001/produtos"
            );

            if (!resposta.ok) {
                throw new Error(
                    "Não foi possível carregar os produtos."
                );
            }

            const dados = await resposta.json();

            setProdutos(dados);

        } catch (error) {

            console.error(error);

            setErro(error.message);

        } finally {

            setCarregando(false);

        }
    }

    function removerProduto(id) {

        setProdutos(
            produtos.filter(
                produto => produto._id !== id
            )
        );
    }

    if (carregando) {

        return (
            <div className="produtos">
                <h1>Carregando produtos...</h1>
            </div>
        );

    }

    if (erro) {

        return (
            <div className="produtos">
                <h1>Erro</h1>
                <p>{erro}</p>
            </div>
        );

    }

    return (

        <main className="produtos">

            <div className="produtos-container">

                <div className="produtos-header">

                    <h1>
                        Produtos
                    </h1>

                    <p>
                        Produtos disponíveis na loja
                    </p>

                </div>
<br /><br />
                {produtos.length === 0 ? (

                    <div className="sem-produtos">

                        <h2>
                            Nenhum produto cadastrado
                        </h2>

                        <p>
                            Cadastre um produto para ele aparecer aqui.
                        </p>

                    </div>

                ) : (

                    <div className="produtos-grid">

                        {produtos.map((produto) => (

                            <ProdutoCard
                                key={produto._id}
                                produto={produto}
                                onExcluir={removerProduto}
                            />

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}

export default Produtos;