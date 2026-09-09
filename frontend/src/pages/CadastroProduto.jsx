import { useState } from "react";
import "./CadastroProduto.css";

function CadastroProduto() {
    const [formulario, setFormulario] = useState({
        nome: "",
        descricao: "",
        preco: "",
        estoque: "",
        imagem: ""
    });

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    async function cadastrarProduto(event) {
        event.preventDefault();

        setMensagem("");
        setErro("");

        if (
            !formulario.nome.trim() ||
            !formulario.descricao.trim() ||
            !formulario.preco ||
            formulario.estoque === ""
        ) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        if (Number(formulario.preco) <= 0) {
            setErro("O preço deve ser maior que zero.");
            return;
        }

        if (Number(formulario.estoque) < 0) {
            setErro("O estoque não pode ser negativo.");
            return;
        }

        try {
            setCarregando(true);

            const produto = {
                nome: formulario.nome.trim(),
                descricao: formulario.descricao.trim(),
                preco: Number(formulario.preco),
                estoque: Number(formulario.estoque),
                imagem: formulario.imagem.trim()
            };

            console.log("Enviando produto:", produto);

            const resposta = await fetch(
                "http://localhost:3001/produtos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(produto)
                }
            );

            const texto = await resposta.text();

            console.log("Resposta do servidor:", texto);

            let dados;

            try {
                dados = JSON.parse(texto);
            } catch {
                console.error(
                    "Resposta não é JSON:",
                    texto
                );

                throw new Error(
                    "O servidor não retornou uma resposta válida. Verifique o Backend."
                );
            }

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                    dados.message ||
                    "Erro ao cadastrar produto."
                );
            }

            console.log(
                "Produto cadastrado:",
                dados
            );

            setMensagem(
                "Produto cadastrado com sucesso no MongoDB!"
            );

            setFormulario({
                nome: "",
                descricao: "",
                preco: "",
                estoque: "",
                imagem: ""
            });
        } catch (error) {
            console.error(
                "Erro ao cadastrar produto:",
                error
            );

            setErro(
                error.message ||
                "Não foi possível cadastrar o produto."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <section className="cadastro-produto">
            <div className="cadastro-container">
                <div className="cadastro-header">
                    <h1>Cadastrar Produto</h1>

                    <p>
                        Adicione um novo produto à sua loja.
                    </p>
                </div>

                {mensagem && (
                    <div className="mensagem sucesso">
                        {mensagem}
                    </div>
                )}

                {erro && (
                    <div className="mensagem erro">
                        {erro}
                    </div>
                )}

                <form
                    className="cadastro-form"
                    onSubmit={cadastrarProduto}
                >
                    <div className="campo">
                        <label htmlFor="nome">
                            Nome do produto *
                        </label>

                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formulario.nome}
                            onChange={handleChange}
                            placeholder="Ex: Notebook Gamer"
                            disabled={carregando}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="descricao">
                            Descrição *
                        </label>

                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formulario.descricao}
                            onChange={handleChange}
                            placeholder="Digite a descrição do produto..."
                            rows="5"
                            disabled={carregando}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="preco">
                            Preço *
                        </label>

                        <input
                            type="number"
                            id="preco"
                            name="preco"
                            value={formulario.preco}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            disabled={carregando}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="estoque">
                            Estoque *
                        </label>

                        <input
                            type="number"
                            id="estoque"
                            name="estoque"
                            value={formulario.estoque}
                            onChange={handleChange}
                            placeholder="Quantidade em estoque"
                            min="0"
                            step="1"
                            disabled={carregando}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="imagem">
                            Imagem do produto
                        </label>

                        <input
                            type="text"
                            id="imagem"
                            name="imagem"
                            value={formulario.imagem}
                            onChange={handleChange}
                            placeholder="Cole aqui a URL da imagem"
                            disabled={carregando}
                        />
                    </div>

                    <button
                        type="submit"
                        className="botao-cadastrar"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Cadastrando..."
                            : "Cadastrar Produto"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default CadastroProduto;