import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Pedido.css";

function Pedido() {

    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    const [atualizando, setAtualizando] = useState(null);


    // ==========================================
    // USUÁRIO
    // ==========================================

    function obterUsuario() {

        const usuarioSalvo =
            localStorage.getItem("usuario");

        if (!usuarioSalvo) {
            return null;
        }

        try {

            return JSON.parse(
                usuarioSalvo
            );

        } catch {

            return null;

        }

    }


    // ==========================================
    // BUSCAR PEDIDOS
    // ==========================================

    useEffect(() => {

        buscarPedidos();

    }, []);


    async function buscarPedidos() {

        try {

            setCarregando(true);

            setErro("");

            const usuario =
                obterUsuario();


            if (!usuario) {

                navigate("/", {
                    replace: true
                });

                return;

            }


            // ==========================================
            // GERENTE
            // ==========================================

            if (
                usuario.tipo === "gerente"
            ) {

                const resposta =
                    await fetch(
                        "http://localhost:3001/pedidos"
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        "Erro ao buscar pedidos."
                    );

                }


                setPedidos(dados);

                return;

            }


            // ==========================================
            // CLIENTE
            // ==========================================

            const usuarioId =
                usuario.id ||
                usuario._id;


            const resposta =
                await fetch(

                    `http://localhost:3001/pedidos/usuario/${usuarioId}`

                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Erro ao buscar pedidos."
                );

            }


            setPedidos(dados);


        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao carregar pedidos."
            );

        } finally {

            setCarregando(false);

        }

    }


    // ==========================================
    // ALTERAR STATUS
    // ==========================================

    async function alterarStatus(
        pedidoId,
        novoStatus
    ) {

        try {

            setAtualizando(
                pedidoId
            );


            const resposta =
                await fetch(

                    `http://localhost:3001/pedidos/${pedidoId}/status`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            status:
                                novoStatus

                        })

                    }

                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(

                    dados.mensagem ||
                    "Erro ao atualizar status."

                );

            }


            // Atualizar a tela
            // sem precisar recarregar

            setPedidos(
                pedidos.map(
                    pedido => {

                        if (
                            pedido._id ===
                            pedidoId
                        ) {

                            return {
                                ...pedido,
                                status:
                                    dados.pedido.status
                            };

                        }

                        return pedido;

                    }
                )
            );


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Erro ao atualizar status."
            );

        } finally {

            setAtualizando(
                null
            );

        }

    }


    // ==========================================
    // FORMATAÇÃO
    // ==========================================

    function formatarData(data) {

        if (!data) {
            return "Data não disponível";
        }

        return new Date(
            data
        ).toLocaleString(
            "pt-BR"
        );

    }


    // ==========================================
    // STATUS
    // ==========================================

    function classeStatus(status) {

        if (
            status === "Enviado"
        ) {

            return "status-enviado";

        }

        return "status-pendente";

    }


    // ==========================================
    // CARREGANDO
    // ==========================================

    if (carregando) {

        return (

            <main className="pedidos">

                <div className="pedidos-status">

                    <h2>
                        Carregando pedidos...
                    </h2>

                </div>

            </main>

        );

    }


    // ==========================================
    // ERRO
    // ==========================================

    if (erro) {

        return (

            <main className="pedidos">

                <div className="pedidos-status erro">

                    <h2>
                        Erro ao carregar pedidos
                    </h2>

                    <p>
                        {erro}
                    </p>

                    <button
                        onClick={
                            buscarPedidos
                        }
                    >
                        Tentar novamente
                    </button>

                </div>

            </main>

        );

    }


    const usuario =
        obterUsuario();


    // ==========================================
    // AGRUPAR PEDIDOS POR CLIENTE
    // ==========================================

    const clientes = {};

    if (
        usuario?.tipo === "gerente"
    ) {

        pedidos.forEach(
            pedido => {

                const chave =
                    pedido.usuarioId;

                if (
                    !clientes[chave]
                ) {

                    clientes[chave] = {

                        nome:
                            pedido.usuarioNome,

                        email:
                            pedido.usuarioEmail,

                        pedidos: []

                    };

                }

                clientes[chave]
                    .pedidos
                    .push(pedido);

            }
        );

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <main className="pedidos">

            <div className="pedidos-container">


                {/* =================================
                    CLIENTE
                ================================== */}

                {usuario?.tipo !== "gerente" ? (

                    <>

                        <div className="pedidos-header">

                            <h1>
                                Meus Pedidos
                            </h1>

                            <p>
                                Confira os pedidos realizados na sua conta.
                            </p>

                        </div>


                        {pedidos.length === 0 ? (

                            <div className="pedidos-vazio">

                                <h2>
                                    Nenhum pedido encontrado
                                </h2>

                                <p>
                                    Quando você finalizar uma compra,
                                    ela aparecerá aqui.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/produtos"
                                        )
                                    }
                                >
                                    Ver produtos
                                </button>

                            </div>

                        ) : (

                            <div className="pedidos-lista">

                                {pedidos.map(
                                    pedido => (

                                        <div
                                            className="pedido-card"
                                            key={
                                                pedido._id
                                            }
                                        >

                                            <div className="pedido-topo">

                                                <div>

                                                    <h2>
                                                        Pedido #
                                                        {
                                                            pedido._id
                                                                ?.slice(-6)
                                                        }
                                                    </h2>

                                                    <span
                                                        className={
                                                            classeStatus(
                                                                pedido.status
                                                            )
                                                        }
                                                    >
                                                        {
                                                            pedido.status
                                                        }
                                                    </span>

                                                </div>

                                                

                                            </div>


                                            <p className="pedido-data">

                                                Pedido realizado em:{" "}

                                                {
                                                    formatarData(
                                                        pedido.createdAt
                                                    )
                                                }

                                            </p>


                                            <div className="pedido-produtos">

                                                {pedido.produtos?.map(
                                                    (
                                                        produto,
                                                        index
                                                    ) => (

                                                        <div
                                                            className="pedido-produto"
                                                            key={
                                                                index
                                                            }
                                                        >

                                                            {produto.imagem ? (

                                                                <img
                                                                    src={
                                                                        produto.imagem
                                                                    }
                                                                    alt={
                                                                        produto.nome
                                                                    }
                                                                />

                                                            ) : (

                                                                <div className="pedido-produto-sem-imagem">
                                                                    Sem imagem
                                                                </div>

                                                            )}


                                                            <div className="pedido-produto-info">

                                                                <h3>
                                                                    {
                                                                        produto.nome
                                                                    }
                                                                </h3>

                                                                <p>
                                                                    Quantidade:{" "}
                                                                    {
                                                                        produto.quantidade
                                                                    }
                                                                </p>

                                                                <p>
                                                                    Preço unitário: R${" "}
                                                                    {Number(
                                                                        produto.preco
                                                                    ).toFixed(2)}
                                                                </p>

                                                            </div>


                                                            <strong>

                                                                R${" "}

                                                                {(
                                                                    Number(
                                                                        produto.preco
                                                                    ) *

                                                                    Number(
                                                                        produto.quantidade
                                                                    )
                                                                ).toFixed(2)}

                                                            </strong>

                                                        </div>

                                                    )
                                                )}

                                            </div>


                                            <div className="pedido-final">

                                                <span>
                                                    Total do pedido
                                                </span>

                                                <strong>
                                                    R${" "}
                                                    {Number(
                                                        pedido.total
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </>

                ) : (


                    /* =================================
                       GERENTE
                    ================================== */

                    <>

                        <div className="pedidos-header">

                            <h1>
                                Pedidos dos Clientes
                            </h1>

                            <p>
                                Gerencie os pedidos realizados pelos clientes.
                            </p>

                        </div>


                        {Object.keys(clientes).length === 0 ? (

                            <div className="pedidos-vazio">

                                <h2>
                                    Nenhum pedido realizado
                                </h2>

                                <p>
                                    Os pedidos dos clientes aparecerão aqui.
                                </p>

                            </div>

                        ) : (

                            <div className="pedidos-clientes">

                                {Object.entries(
                                    clientes
                                ).map(
                                    (
                                        [
                                            clienteId,
                                            cliente
                                        ]
                                    ) => (

                                        <section
                                            className="cliente-pedidos"
                                            key={
                                                clienteId
                                            }
                                        >


                                            {/* CLIENTE */}

                                            <div className="cliente-header">

                                                <div>

                                                    <h2>
                                                        {
                                                            cliente.nome
                                                        }
                                                    </h2>

                                                    <p>
                                                        {
                                                            cliente.email
                                                        }
                                                    </p>

                                                </div>


                                                <span>

                                                    {
                                                        cliente.pedidos.length
                                                    }{" "}

                                                    pedido(s)

                                                </span>

                                            </div>


                                            {/* PEDIDOS */}

                                            <div className="pedidos-lista">

                                                {cliente.pedidos.map(
                                                    pedido => (

                                                        <div
                                                            className="pedido-card"
                                                            key={
                                                                pedido._id
                                                            }
                                                        >


                                                            <div className="pedido-topo">

                                                                <div>

                                                                    <h2>
                                                                        Pedido #
                                                                        {
                                                                            pedido._id
                                                                                ?.slice(-6)
                                                                        }
                                                                    </h2>

                                                                    <span
                                                                        className={
                                                                            classeStatus(
                                                                                pedido.status
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            pedido.status
                                                                        }
                                                                    </span>

                                                                </div>


                                                                <strong>

                                                                    R${" "}

                                                                    {Number(
                                                                        pedido.total
                                                                    ).toFixed(2)}

                                                                </strong>

                                                            </div>


                                                            <p className="pedido-data">

                                                                Pedido realizado em:{" "}

                                                                {
                                                                    formatarData(
                                                                        pedido.createdAt
                                                                    )
                                                                }

                                                            </p>


                                                            {/* PRODUTOS */}

                                                            <div className="pedido-produtos">

                                                                {pedido.produtos?.map(
                                                                    (
                                                                        produto,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            className="pedido-produto"
                                                                            key={
                                                                                index
                                                                            }
                                                                        >

                                                                            {produto.imagem ? (

                                                                                <img
                                                                                    src={
                                                                                        produto.imagem
                                                                                    }
                                                                                    alt={
                                                                                        produto.nome
                                                                                    }
                                                                                />

                                                                            ) : (

                                                                                <div className="pedido-produto-sem-imagem">
                                                                                    Sem imagem
                                                                                </div>

                                                                            )}


                                                                            <div className="pedido-produto-info">

                                                                                <h3>
                                                                                    {
                                                                                        produto.nome
                                                                                    }
                                                                                </h3>

                                                                                <p>
                                                                                    Quantidade:{" "}
                                                                                    {
                                                                                        produto.quantidade
                                                                                    }
                                                                                </p>

                                                                                <p>
                                                                                    Preço unitário: R${" "}
                                                                                    {Number(
                                                                                        produto.preco
                                                                                    ).toFixed(2)}
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    )
                                                                )}

                                                            </div>


                                                            {/* CONTROLE DO GERENTE */}

                                                            <div className="pedido-gerente-acoes">

                                                                <span>
                                                                    Alterar status:
                                                                </span>


                                                                <button
                                                                    className={
                                                                        pedido.status === "Pendente"
                                                                            ? "status-botao ativo-pendente"
                                                                            : "status-botao"
                                                                    }
                                                                    disabled={
                                                                        atualizando === pedido._id
                                                                    }
                                                                    onClick={() =>
                                                                        alterarStatus(
                                                                            pedido._id,
                                                                            "Pendente"
                                                                        )
                                                                    }
                                                                >
                                                                    Pendente
                                                                </button>


                                                                <button
                                                                    className={
                                                                        pedido.status === "Enviado"
                                                                            ? "status-botao ativo-enviado"
                                                                            : "status-botao"
                                                                    }
                                                                    disabled={
                                                                        atualizando === pedido._id
                                                                    }
                                                                    onClick={() =>
                                                                        alterarStatus(
                                                                            pedido._id,
                                                                            "Enviado"
                                                                        )
                                                                    }
                                                                >
                                                                    Enviado
                                                                </button>

                                                            </div>


                                                            <div className="pedido-final">

                                                                <span>
                                                                    Total do pedido
                                                                </span>

                                                                <strong>

                                                                    R${" "}

                                                                    {Number(
                                                                        pedido.total
                                                                    ).toFixed(2)}

                                                                </strong>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </section>

                                    )
                                )}

                            </div>

                        )}

                    </>

                )}

            </div>

        </main>

    );

}

export default Pedido;