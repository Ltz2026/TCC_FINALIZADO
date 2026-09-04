import { Link } from "react-router-dom";

import "./Navbar.css";

function Navbar() {

    const usuarioSalvo = localStorage.getItem("usuario");

    let usuario = null;

    if (usuarioSalvo) {

        try {
            usuario = JSON.parse(usuarioSalvo);
        } catch {
            usuario = null;
        }

    }

    const gerente = usuario?.tipo === "gerente";

    return (

        <nav className="navbar">

            <div className="navbar-container">

                {gerente ? (

                    <>
                        <Link to="/produtos">
                            Produtos
                        </Link>

                        <Link to="/cadastro-produto">
                            Cadastrar Produto
                        </Link>

                        <Link to="/pedidos">
                            Pedidos
                        </Link>
                    </>

                ) : (

                    <>
                        <Link to="/produtos">
                            Produtos
                        </Link>

                        <Link to="/carrinho">
                            Carrinho
                        </Link>

                        <Link to="/pedidos">
                            Pedidos
                        </Link>
                    </>

                )}

            </div>

        </nav>
    );
}

export default Navbar;