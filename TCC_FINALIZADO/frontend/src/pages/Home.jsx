import { useEffect, useState } from "react";
import imagem from "../assets/imagemilus.png"
import "./Home.css";

function Home() {

    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        buscarProdutos();
    }, []);

    async function buscarProdutos() {

        try {

            const resposta = await fetch(
                "http://localhost:3001/produtos"
            );

            const dados = await resposta.json();

            setProdutos(dados);

        } catch (error) {

            console.error(
                "Erro ao buscar produtos:",
                error
            );

        } finally {

            setCarregando(false);

        }
    }


    return (

        <div className="home">

            {/* =========================================
                BANNER
            ========================================= */}

            <img
                src={imagem}
                alt="LtStore"
                className="imagemtelainteira"
            />
        


             


            {/* =========================================
                BENEFÍCIOS
            ========================================= */}

            <section className="home-beneficios">

                <div className="home-container">

                    <div className="beneficios-grid">


                        {/* ENTREGA RÁPIDA */}

                        <div className="beneficio">

                            <div className="beneficio-icone">
                                →
                            </div>

                            <h3>
                                Entrega rápida
                            </h3>

                            <p>
                                Enviamos seus produtos com
                                agilidade e segurança.
                            </p>

                        </div>


                        {/* COMPRA SEGURA */}

                        <div className="beneficio">

                            <div className="beneficio-icone">
                                ✓
                            </div>

                            <h3>
                                Compra segura
                            </h3>

                            <p>
                                Seus dados protegidos durante
                                toda a compra.
                            </p>

                        </div>


                    </div>

                </div>

            </section>

        </div>

    );
}

export default Home;